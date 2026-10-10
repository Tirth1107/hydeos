/**
 * Hyde Ecosystem Website
 * Main JavaScript functionality
 */

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    fetchHydeMusicLatestRelease();
    fetchHydeDownloaderLatestRelease();
    setupSmoothScrolling();
}

/**
 * Fetch latest Hyde Music APK release from GitHub API
 */
async function fetchHydeMusicLatestRelease() {
    const downloadContainer = document.getElementById('hyde-music-download');
    if (!downloadContainer) return;

    try {
        const response = await fetch(
            'https://api.github.com/repos/Hyde-OpenSource/Hyde-Music-Andorid/releases/latest',
            {
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                }
            }
        );

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }

        const releaseData = await response.json();
        // arm64 fits almost every phone and is half the size; then universal; then any APK.
        const apks = releaseData.assets.filter(asset => asset.name.toLowerCase().endsWith('.apk'));
        const apkAsset = apks.find(a => a.name.toLowerCase().includes('arm64'))
            || apks.find(a => a.name.toLowerCase().includes('universal'))
            || apks[0];

        if (apkAsset) {
            const version = releaseData.tag_name || releaseData.name || 'Latest';
            downloadContainer.innerHTML = createDownloadButton(
                apkAsset.browser_download_url,
                version
            );
        } else {
            // Fallback to release page if no APK found
            const version = releaseData.tag_name || releaseData.name || 'Latest';
            downloadContainer.innerHTML = createFallbackButton(
                releaseData.html_url,
                version
            );
        }
    } catch (error) {
        console.error('Failed to fetch Hyde Music release:', error);
        downloadContainer.innerHTML = createErrorButton();
    }
}

/**
 * Create download button HTML
 */
function createDownloadButton(downloadUrl, version) {
    return `
        <a href="${escapeHtml(downloadUrl)}" class="btn btn-secondary" download>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Download APK (${escapeHtml(version)})
        </a>
    `;
}

/**
 * Create fallback button for release page
 */
function createFallbackButton(releaseUrl, version) {
    return `
        <a href="${escapeHtml(releaseUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="13 3 23 3 23 13"></polyline>
                <line x1="23" y1="3" x2="13" y2="13"></line>
            </svg>
            View Release (${escapeHtml(version)})
        </a>
    `;
}

/**
 * Create error fallback button
 */
function createErrorButton() {
    return `
        <a href="https://github.com/Hyde-OpenSource/Hyde-Music-Andorid/releases/latest" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="13 3 23 3 23 13"></polyline>
                <line x1="23" y1="3" x2="13" y2="13"></line>
            </svg>
            Latest Release
        </a>
    `;
}

/**
 * Fetch latest Hyde Downloader EXE release from GitHub API
 */
async function fetchHydeDownloaderLatestRelease() {
    const downloadContainer = document.getElementById('hyde-downloader-download');
    if (!downloadContainer) return;

    try {
        const response = await fetch(
            'https://api.github.com/repos/Tirth1107/Hyde-Downloader/releases/latest',
            {
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                }
            }
        );

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }

        const releaseData = await response.json();
        const exeAsset = releaseData.assets.find(asset => 
            asset.name.toLowerCase().endsWith('.exe')
        );

        if (exeAsset) {
            const version = releaseData.tag_name || releaseData.name || 'Latest';
            downloadContainer.innerHTML = createExeDownloadButton(
                exeAsset.browser_download_url,
                version
            );
        } else {
            const version = releaseData.tag_name || releaseData.name || 'Latest';
            downloadContainer.innerHTML = createExeFallbackButton(
                releaseData.html_url,
                version
            );
        }
    } catch (error) {
        console.error('Failed to fetch Hyde Downloader release:', error);
        downloadContainer.innerHTML = createExeErrorButton();
    }
}

function createExeDownloadButton(downloadUrl, version) {
    return `
        <a href="${escapeHtml(downloadUrl)}" class="btn btn-secondary w-full flex justify-center items-center gap-2" download>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Download Windows App (${escapeHtml(version)})
        </a>
    `;
}

function createExeFallbackButton(releaseUrl, version) {
    return `
        <a href="${escapeHtml(releaseUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary w-full flex justify-center items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="13 3 23 3 23 13"></polyline>
                <line x1="23" y1="3" x2="13" y2="13"></line>
            </svg>
            View Release (${escapeHtml(version)})
        </a>
    `;
}

function createExeErrorButton() {
    return `
        <a href="https://github.com/Tirth1107/Hyde-Downloader/releases/latest" target="_blank" rel="noopener noreferrer" class="btn btn-secondary w-full flex justify-center items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="13 3 23 3 23 13"></polyline>
                <line x1="23" y1="3" x2="13" y2="13"></line>
            </svg>
            Latest Release (GitHub)
        </a>
    `;
}

/**
 * Enhanced smooth scrolling for internal links
 */
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            // Update URL without page jump
            window.history.pushState(null, null, href);
        });
    });
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Performance: Lazy load images if needed in future
 */
function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}
