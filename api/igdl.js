// Required dependencies
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const FormData = require('form-data');
const qs = require('qs');
const router = express.Router();

/**
 * Format numbers to short form (e.g., 1.2K, 3.5M)
 * @param {number} number - The number to format
 * @return {string} Formatted number
 */
function formatShortNumber(number) {
    if (number >= 1e6) {
        return (number / 1e6).toFixed(1) + "M";
    } else if (number >= 1e3) {
        return (number / 1e3).toFixed(1) + "K";
    }
    return number.toString();
}

/**
 * Instagram API headers
 */
const INSTAGRAM_HEADERS = {
    Accept: "*/*",
    "Accept-Language": "en-US,en;q=0.5",
    "Content-Type": "application/x-www-form-urlencoded",
    "X-FB-Friendly-Name": "PolarisPostActionLoadPostQueryQuery",
    "X-CSRFToken": "RVDUooU5MYsBbS1CNN3CzVAuEP8oHB52",
    "X-IG-App-ID": "1217981644879628",
    "X-FB-LSD": "AVqbxe3J_YA",
    "X-ASBD-ID": "129477",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "User-Agent": "Mozilla/5.0 (Linux; Android 11; SAMSUNG SM-G973U) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/14.2 Chrome/87.0.4280.141 Mobile Safari/537.36",
};

/**
 * Extract Instagram post ID from URL
 * @param {string} url - Instagram URL
 * @return {string|null} Post ID or null if invalid
 */
function getInstagramPostId(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:p|tv|stories|reel)\/([^/?#&]+).*/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

/**
 * Validate if URL is from Instagram or Facebook
 * @param {string} url - URL to validate
 * @return {boolean} Whether URL is valid
 */
function isValidUrl(url) {
    const instagramRegex = /(https|http):\/\/www.instagram.com\/(p|reel|tv|stories)/gi;
    const facebookRegex = /(?:https?:\/\/(web\.|www\.|m\.)?(facebook|fb)\.(com|watch)\S+)?$/;
    
    return instagramRegex.test(url) || facebookRegex.test(url);
}

/**
 * Download content using SnapSave service
 * @param {string} url - Instagram/Facebook URL
 * @return {Promise} Promise with download links
 */
function getDownloadLinks(url) {
    return new Promise(async (resolve, reject) => {
        try {
            if (!isValidUrl(url)) {
                return reject({
                    status: false,
                    msg: "Invalid URL format"
                });
            }

            function decodeData(data) {
                let [part1, part2, part3, part4, part5, part6] = data;

                function decodeSegment(segment, base, length) {
                    const charSet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/".split("");
                    let baseSet = charSet.slice(0, base);
                    let decodeSet = charSet.slice(0, length);

                    let decodedValue = segment.split("").reverse().reduce((accum, char, index) => {
                        if (baseSet.indexOf(char) !== -1) {
                            return accum += baseSet.indexOf(char) * Math.pow(base, index);
                        }
                        return accum;
                    }, 0);

                    let result = "";
                    while (decodedValue > 0) {
                        result = decodeSet[decodedValue % length] + result;
                        decodedValue = Math.floor(decodedValue / length);
                    }

                    return result || "0";
                }

                part6 = "";
                for (let i = 0, len = part1.length; i < len; i++) {
                    let segment = "";
                    while (i < len && part1[i] !== part3[part5]) {
                        segment += part1[i];
                        i++;
                    }

                    for (let j = 0; j < part3.length; j++) {
                        segment = segment.replace(new RegExp(part3[j], "g"), j.toString());
                    }
                    part6 += String.fromCharCode(decodeSegment(segment, part5, 10) - part4);
                }
                return decodeURIComponent(encodeURIComponent(part6));
            }

            function extractParams(data) {
                const parts = data.split("decodeURIComponent(escape(r))}(");
                if (parts.length < 2) {
                    throw new Error("Unable to extract parameters from response");
                }
                return parts[1].split("))")[0].split(",").map(item => item.replace(/"/g, "").trim());
            }

            function extractDownloadUrl(data) {
                const parts = data.split("getElementById(\"download-section\").innerHTML = \"");
                if (parts.length < 2) {
                    throw new Error("Unable to extract download URL from response");
                }
                return parts[1].split("\"; document.getElementById(\"inputData\").remove(); ")[0].replace(/\\(\\)?/g, "");
            }

            function getVideoUrl(data) {
                return extractDownloadUrl(decodeData(extractParams(data)));
            }

            const response = await axios.post("https://snapsave.app/action.php?lang=id", "url=" + encodeURIComponent(url), {
                headers: {
                    accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                    "content-type": "application/x-www-form-urlencoded",
                    origin: "https://snapsave.app",
                    referer: "https://snapsave.app/id",
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36"
                },
                timeout: 15000 // 15 seconds timeout
            });

            const data = response.data;
            const videoPageContent = getVideoUrl(data);
            const $ = cheerio.load(videoPageContent);
            const downloadLinks = [];

            $("div.download-items__btn a").each((index, element) => {
                let downloadUrl = $(element).attr("href");
                if (downloadUrl && !/https?:\/\//.test(downloadUrl)) {
                    downloadUrl = "https://snapsave.app" + downloadUrl;
                }
                if (downloadUrl) {
                    downloadLinks.push(downloadUrl);
                }
            });

            if (!downloadLinks.length) {
                return reject({
                    status: false,
                    msg: "No download links found"
                });
            }

            return resolve({
                status: true,
                url: downloadLinks,
                metadata: {
                    url: url
                }
            });
        } catch (error) {
            return reject({
                status: false,
                msg: error.message || "Failed to get download links"
            });
        }
    });
}

/**
 * Encode GraphQL request data for Instagram API
 * @param {string} shortcode - Instagram post ID
 * @return {string} Encoded request data
 */
function encodeGraphqlRequestData(shortcode) {
    const requestData = {
        av: "0",
        __d: "www",
        __user: "0",
        __a: "1",
        __req: "3",
        __hs: "19624.HYP:instagram_web_pkg.2.1..0.0",
        dpr: "3",
        __ccg: "UNKNOWN",
        __rev: "1008824440",
        __s: "xf44ne:zhh75g:xr51e7",
        __hsi: "7282217488877343271",
        __dyn: "7xeUmwlEnwn8K2WnFw9-2i5U4e0yoW3q32360CEbo1nEhw2nVE4W0om78b87C0yE5ufz81s8hwGwQwoEcE7O2l0Fwqo31w9a9x-0z8-U2zxe2GewGwso88cobEaU2eUlwhEe87q7-0iK2S3qazo7u1xwIw8O321LwTwKG1pg661pwr86C1mwraCg",
        __csr: "gZ3yFmJkillQvV6ybimnG8AmhqujGbLADgjyEOWz49z9XDlAXBJpC7Wy-vQTSvUGWGh5u8KibG44dBiigrgjDxGjU0150Q0848azk48N09C02IR0go4SaR70r8owyg9pU0V23hwiA0LQczA48S0f-x-27o05NG0fkw",
        __comet_req: "7",
        lsd: "AVqbxe3J_YA",
        jazoest: "2957",
        __spin_r: "1008824440",
        __spin_b: "trunk",
        __spin_t: "1695523385",
        fb_api_caller_class: "RelayModern",
        fb_api_req_friendly_name: "PolarisPostActionLoadPostQueryQuery",
        variables: JSON.stringify({
            shortcode: shortcode,
            fetch_comment_count: null,
            fetch_related_profile_media_count: null,
            parent_comment_count: null,
            child_comment_count: null,
            fetch_like_count: null,
            fetch_tagged_user_count: null,
            fetch_preview_comment_count: null,
            has_threaded_comments: false,
            hoisted_comment_id: null,
            hoisted_reply_id: null,
        }),
        server_timestamps: "true",
        doc_id: "10015901848480474",
    };

    return qs.stringify(requestData);
}

/**
 * Get Instagram post data using GraphQL API
 * @param {string} postId - Instagram post ID
 * @param {object|null} proxy - HTTP proxy config
 * @return {Promise} Promise with post data
 */
async function getPostGraphqlData(postId, proxy = null) {
    try {
        const encodedData = encodeGraphqlRequestData(postId);
        const config = {
            headers: INSTAGRAM_HEADERS,
            timeout: 15000 // 15 seconds timeout
        };
        
        if (proxy) {
            config.httpsAgent = proxy;
        }
        
        const response = await axios.post(
            "https://www.instagram.com/api/graphql",
            encodedData,
            config
        );
        
        if (!response.data || !response.data.data || !response.data.data.xdt_shortcode_media) {
            throw new Error("Invalid response from Instagram API");
        }
        
        return response.data;
    } catch (error) {
        throw new Error(`GraphQL request failed: ${error.message || "Unknown error"}`);
    }
}

/**
 * Extract post information from Instagram media data
 * @param {object} mediaData - Instagram media data
 * @return {object} Formatted post info
 */
function extractPostInfo(mediaData) {
    try {
        if (!mediaData) {
            throw new Error("No media data provided");
        }
        
        const getUrlFromData = (data) => {
            if (data.edge_sidecar_to_children) {
                return data.edge_sidecar_to_children.edges.map(
                    (edge) => edge.node.video_url || edge.node.display_url,
                );
            }
            return data.video_url ? [data.video_url] : [data.display_url];
        };

        return {
            status: true,
            url: getUrlFromData(mediaData),
            metadata: {
                caption: mediaData.edge_media_to_caption?.edges[0]?.node?.text || null,
                username: mediaData.owner?.username || "unknown",
                like: formatShortNumber(mediaData.edge_media_preview_like?.count || 0),
                comment: formatShortNumber(mediaData.edge_media_to_comment?.count || 0),
                isVideo: !!mediaData.is_video,
            }
        };
    } catch (error) {
        throw new Error(`Failed to extract post info: ${error.message}`);
    }
}

/**
 * Get Instagram content using direct GraphQL API
 * @param {string} url - Instagram URL
 * @param {object|null} proxy - HTTP proxy config
 * @return {Promise} Promise with content data
 */
async function ig(url, proxy = null) {
    const postId = getInstagramPostId(url);
    if (!postId) {
        throw new Error("Invalid Instagram URL");
    }
    
    try {
        const data = await getPostGraphqlData(postId, proxy);
        const mediaData = data.data?.xdt_shortcode_media;
        if (!mediaData) {
            throw new Error("No media data found");
        }
        
        return extractPostInfo(mediaData);
    } catch (error) {
        throw error;
    }
}

/**
 * Download Instagram content using SnapInst service
 * @param {string} url - Instagram URL
 * @return {Promise} Promise with download info
 */
async function snapinst(url) {
    try {
        // Get initial page to retrieve CSRF token
        const { data } = await axios.get('https://snapinst.app/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 11; SAMSUNG SM-G973U) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/14.2 Chrome/87.0.4280.141 Mobile Safari/537.36'
            },
            timeout: 15000
        });
        
        const $ = cheerio.load(data);
        const token = $('input[name=token]').attr('value');
        
        if (!token) {
            throw new Error("Failed to retrieve token from SnapInst");
        }
        
        const form = new FormData();
        form.append('url', url);
        form.append('action', 'post');
        form.append('lang', '');
        form.append('cf-turnstile-response', '');
        form.append('token', token);

        const headers = {
            ...form.getHeaders(),
            'accept': '*/*',
            'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
            'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132"',
            'sec-ch-ua-mobile': '?1',
            'sec-ch-ua-platform': '"Android"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'Referer': 'https://snapinst.app/',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 11; SAMSUNG SM-G973U) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/14.2 Chrome/87.0.4280.141 Mobile Safari/537.36'
        };

        const response = await axios.post(
            'https://snapinst.app/action2.php', 
            form, 
            { headers, timeout: 15000 }
        );
        
        if (!response.data) {
            throw new Error("Empty response from SnapInst");
        }

        // Process JavaScript response
        const processedJs = response.data.replace('eval', 'return');
        const ayok = new Function('return ' + processedJs)();
        
        // Extract HTML content
        const htmlMatch = ayok.match(/\.innerHTML\s*=\s*(.+?);\s*document\./);
        if (!htmlMatch || !htmlMatch[1]) {
            throw new Error("Failed to extract HTML content");
        }
        
        const htmlContent = eval(htmlMatch[1]);
        const _ = cheerio.load(htmlContent);
        
        const username = _('.row div.left:eq(0)').text().trim();
        const urls = _('.row .download-item a').map((i, el) => _(el).attr('href')).get().filter(Boolean);
        
        if (!urls.length) {
            throw new Error("No download URLs found");
        }
        
        return {
            status: true,
            username,
            url: urls,
            metadata: {
                url: url
            }
        };
    } catch (e) {
        console.error("SnapInst error:", e.message);
        return null;
    }
}

/**
 * Main Instagram downloader function
 * @param {string} url - Instagram URL
 * @return {Promise} Promise with download data
 */
async function Instagram(url) {
    if (!url) {
        return {
            status: false,
            msg: "URL is required"
        };
    }
    
    try {
        // First attempt: Direct Instagram API
        let result = await ig(url);
        if (result && result.url && result.url.length) {
            return result;
        }
    } catch (e) {
        console.log("First method failed:", e.message);
        try {
            // Second attempt: SnapSave service
            let result = await getDownloadLinks(url);
            if (result && result.url && result.url.length) {
                return result;
            }
        } catch (e2) {
            console.log("Second method failed:", e2.message);
            try {
                // Third attempt: SnapInst service
                let result = await snapinst(url);
                if (result && result.url && result.url.length) {
                    return result;
                }
            } catch (e3) {
                console.log("Third method failed:", e3.message);
                return {
                    status: false,
                    msg: "All download methods failed. Try again later."
                };
            }
        }
    }
    
    return {
        status: false,
        msg: "Failed to download content. Try again later."
    };
}

// Express route handler
router.get('/', async (req, res) => {
    const url = req.query.url;
    
    if (!url) {
        return res.status(400).json({
            status: false,
            code: 400,
            message: 'URL parameter is required'
        });
    }

    try {
        const result = await Instagram(url);
        
        if (!result || !result.status) {
            return res.status(500).json({
                status: false,
                code: 500,
                message: result?.msg || 'Failed to process the URL'
            });
        }

        res.json({
            status: true,
            code: 200,
            creator: 'AlfiXD',
            result: {
                username: result.metadata?.username || result.username,
                urls: result.url
            }
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            code: 500,
            message: error.message || 'Internal server error'
        });
    }
});

// Add a health check endpoint
router.get('/health', (req, res) => {
    res.json({
        status: true,
        message: 'Instagram downloader service is running'
    });
});

module.exports = router;
