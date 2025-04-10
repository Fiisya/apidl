const apiData = {
    "Downloader": [
        {
            method: "GET",
            title: "YouTube Downloader",
            status: "online",
            description: "API untuk mendownload video atau shorts dari YouTube.",
            endpoint: "/api/ytdl?url=&format="
        },
        {
            method: "GET",
            title: "Twitter Downloader",
            status: "online",
            description: "API untuk mendownload video atau gambar dari Twitter.",
            endpoint: "/api/twitterdl?url="
        },
        {
            method: "GET",
            title: "Instagram Downloader",
            status: "online",
            description: "API untuk mendownload video atau gambar dari Instagram.",
            endpoint: "/api/igdl?url="
        },
        {
            method: "GET",
            title: "Facebook Downloader",
            status: "online",
            description: "API untuk mendownload video dari Facebook.",
            endpoint: "/api/fbdl?url="
        },
        {
            method: "GET",
            title: "TikTok Downloader",
            status: "online",
            description: "API untuk mendownload video dari TikTok.",
            endpoint: "/api/ttdl?url="
        },
        {
            method: "GET",
            title: "GitHub Cloning",
            status: "online",
            description: "Cloning repositori dari GitHub.",
            endpoint: "/api/gitclone?url="
        },
        {
            method: "GET",
            title: "Spotify Downloader",
            status: "online",
            description: "Download semua lagu dari Spotify dengan mudah.",
            endpoint: "/api/spotifydl?url="
        }
    ],
    "Search": [
        {
            method: "GET",
            title: "GitHub Stalk",
            status: "online",
            description: "API untuk melihat profil GitHub pengguna.",
            endpoint: "/api/githubstalk?username="
        },
        {
            method: "GET",
            title: "Search Groups",
            status: "online",
            description: "API untuk mencari grup WhatsApp berdasarkan kata kunci.",
            endpoint: "/api/searchgroups?q="
        },
        {
            method: "GET",
            title: "TikTok Search",
            status: "online",
            description: "API untuk mencari video dari TikTok berdasarkan query.",
            endpoint: "/api/ttsearch?q="
        },
        {
            method: "GET",
            title: "YouTube Search",
            status: "online",
            description: "API untuk mencari video dari YouTube berdasarkan kata kunci atau query.",
            endpoint: "/api/ytsearch?q="
        },
        {
            method: "GET",
            title: "NPM Search",
            status: "online",
            description: "Mencari package/module/library yang tersedia berdasarkan query(q) kamu.",
            endpoint: "/api/npmsearch?q="
        },
        {
            method: "GET",
            title: "Pinterest",
            status: "online",
            description: "Mencari gambar di Pinterest berdasarkan query (q) kamu.",
            endpoint: "/api/pinterest?q="
        },
        {
            method: "GET",
            title: "Spotify Search",
            status: "online",
            description: "Mencari lagu dengan informasi lengkap lainnya berdasarkan query (q) kamu.",
            endpoint: "/api/spotifysearch?q="
        }
    ],
    "AI": [
        {
            method: "GET",
            title: "LLaMA 3.3 70B Versatile",
            status: "online",
            description: "API untuk mengakses model LLaMA 3.3 70B yang serbaguna.",
            endpoint: "/api/llama-3.3-70b-versatile?content="
        },
        {
            method: "GET",
            title: "Gemini AI",
            status: "online",
            description: "API untuk mengakses AI model Gemini yang serbaguna.",
            endpoint: "/api/gemini?text="
        },
        {
            method: "GET",
            title: "Txt2Img",
            status: "online",
            description: "API untuk membuat gambar dari AI dengan style yang banyak.",
            endpoint: "/api/txt2img?prompt=&style="
        }
    ],
    "Tools": [
        {
            method: "GET",
            title: "Screenshot Web",
            status: "online",
            description: "API untuk screenshot website dengan mudah.",
            endpoint: "/api/ssweb?url="
        },
        {
            method: "GET",
            title: "Translate",
            status: "online",
            description: "API untuk translate bahasa apapun menjadi yang kamu inginkan.",
            endpoint: "/api/translate?text=&to="
        },
        {
            method: "GET",
            title: "Nulis",
            status: "online",
            description: "Membuat gambar buku beserta tulisan berdasarkan dari query text kamu.",
            endpoint: "/api/nulis?text="
        },
        {
            method: "GET",
            title: "Cuaca",
            status: "online",
            description: "Mendapatkan informasi Cuaca semua kota di dunia berdasarkan query kota.",
            endpoint: "/api/cuaca?kota="
        },
        {
            method: "GET",
            title: "QR Code Generator",
            status: "online",
            description: "Membuat QR secara otomatis dengan gampang.",
            endpoint: "/api/qrcodegenerator?text="
        },
        {
            method: "GET",
            title: "Credit Card Generator",
            status: "online",
            description: "Fake generator Credit Card hanya untuk Fun",
            endpoint: "/api/vcc?type=&count="
        }
    ],
    "Fun": [
        {
            method: "GET",
            title: "Cek Khodam",
            status: "online",
            description: "Permainan seru yang menunjukkan khodam seseorang berdasarkan nama.",
            endpoint: "/api/cekkhodam?nama="
        },
        {
            method: "GET",
            title: "Tahu Kah Kamu?",
            status: "online",
            description: "Permainan seru yang menunjukkan fakta2 random yang mungkin belom kamu ketahui.",
            endpoint: "/api/tahukahkamu"
        }
    ],
    "Sticker": [
        {
            method: "GET",
            title: "Brat Image",
            status: "online",
            description: "Mengubah text kamu menjadi gambar brat.",
            endpoint: "/api/brat?text="
        },
        {
            method: "POST",
            title: "Quoted Chat",
            status: "offline",
            description: "Membuat gambar dengan desain quoted chat yang bisa kamu custom nama, color, foto profile, dan lainnya.",
            endpoint: "/api/qc"
        }
    ],
    "Berita": [
        {
            method: "GET",
            title: "Detik News",
            status: "online",
            description: "Mendapatkan informasi berita terbaru dari Detik News.",
            endpoint: "/api/detiknews"
        },
        { 
            method: "GET",
            title: "Kompas",
            status: "offline",
            description: "Mendapatkan informasi berita terbaru dari Kompas",
            endpoint: "/api/kompasnews"
        }
    ]      
};

function createApiItem(api) {
    const apiItem = document.createElement('div');
    apiItem.className = 'api-item';

    const apiHeader = document.createElement('div');
    apiHeader.className = 'api-header';

    const apiMethod = document.createElement('span');
    apiMethod.className = 'api-method';
    apiMethod.textContent = api.method;

    const apiTitle = document.createElement('span');
    apiTitle.className = 'api-title';
    apiTitle.textContent = api.title;

    const apiStatusBadge = document.createElement('span');
    apiStatusBadge.className = `api-status-badge ${api.status}`;
    apiStatusBadge.textContent = api.status.toUpperCase();

    apiHeader.appendChild(apiMethod);
    apiHeader.appendChild(apiTitle);
    apiHeader.appendChild(apiStatusBadge);

    const apiDescription = document.createElement('div');
    apiDescription.className = 'api-description';
    apiDescription.style.display = 'none';

    const apiDescriptionText = document.createElement('p');
    apiDescriptionText.textContent = api.description;

    const apiEndpoint = document.createElement('div');
    apiEndpoint.className = 'api-endpoint';
    apiEndpoint.textContent = `Endpoint: ${api.endpoint}`;

    const apiButton = document.createElement('button');
    apiButton.textContent = 'Akses Endpoint';
    apiButton.onclick = () => window.location.href = api.endpoint;

    apiDescription.appendChild(apiDescriptionText);
    apiDescription.appendChild(apiEndpoint);
    apiDescription.appendChild(apiButton);

    apiItem.appendChild(apiHeader);
    apiItem.appendChild(apiDescription);

    return apiItem;
}

function setupToggleDescriptions() {
    const apiHeaders = document.querySelectorAll('.api-header');

    apiHeaders.forEach(header => {
        header.addEventListener('click', function () {
            document.querySelectorAll('.api-description').forEach(desc => {
                desc.style.display = "none";
            });

            const description = this.nextElementSibling;
            if (description.style.display === "none" || !description.style.display) {
                description.style.display = "block";
            } else {
                description.style.display = "none";
            }
        });
    });
}

function updateStatistics() {
    let totalEndpoints = 0;
    let onlineEndpoints = 0;
    let offlineEndpoints = 0;

    for (const category in apiData) {
        apiData[category].forEach(api => {
            totalEndpoints++;
            if (api.status === 'online') {
                onlineEndpoints++;
            } else {
                offlineEndpoints++;
            }
        });
    }

    document.getElementById('total-endpoints').textContent = totalEndpoints;
    document.getElementById('online-endpoints').textContent = onlineEndpoints;
    document.getElementById('offline-endpoints').textContent = offlineEndpoints;
}

function loadApiData() {
    const apiCategoriesContainer = document.getElementById('api-categories');

    for (const category in apiData) {
        const apiCategory = document.createElement('div');
        apiCategory.className = 'api-category';

        const categoryTitle = document.createElement('h2');
        categoryTitle.textContent = category;

        const apiList = document.createElement('div');
        apiList.className = 'api-list';

        apiData[category].forEach(api => {
            const apiItem = createApiItem(api);
            apiList.appendChild(apiItem);
        });

        apiCategory.appendChild(categoryTitle);
        apiCategory.appendChild(apiList);
        apiCategoriesContainer.appendChild(apiCategory);
    }

    setupToggleDescriptions();
    updateStatistics();
}

document.addEventListener('DOMContentLoaded', loadApiData);