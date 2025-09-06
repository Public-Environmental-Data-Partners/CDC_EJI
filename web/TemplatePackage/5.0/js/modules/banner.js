/**
 * @version 4.25.5
 * Date: 2025-05-29T23:13:42.715Z
 */

if (!window.CDC2025BANNER) {
    window.CDC2025BANNER = true;
    document.addEventListener('DOMContentLoaded', () => {

        const lang = String(document.documentElement?.lang).includes('es') ? 'es' : 'en';
        const tp = ('5.0' === document.querySelector('meta[property="cdc:template_version"]')?.getAttribute('content')) ? 5 : 4;

        // <link rel="canonical" href="http://vvvlink.wcms/test/diseases/about/disease-condition-name-basics.html"/>
        const url = String(document.querySelector('link[rel="canonical"]')?.href || location.href).trim().toLowerCase().replace(/[\?\#].*$/, '');
        const path = url.replace(/^https?:\/\/[^\/]+/, '');

        // prep banner

        const addBanner = (bannerVersion) => {
            $('head:first').append(`<style>
				.cdc-banner2025 { background: #FEF0C8; padding: 1rem; border-radius: 0.5rem; margin: 0.5rem auto 1rem auto; font-size: 0.9rem; max-width: 1320px; }
			</style>`);

            // build banner
            const sitename = location.hostname.includes('atsdr') ? 'ATSDR' : 'CDC';
            let text = `${sitename}'s website is being modified to comply with President Trump's Executive Orders.`;
            if (2 === bannerVersion) {
                text = `Per a court order, HHS is required to restore this website as of 11:59PM ET, February 11, 2025.
				Any information on this page promoting gender ideology is extremely inaccurate and disconnected from the immutable biological reality
				that there are two sexes, male and female. The Trump Administration rejects gender ideology and condemns the harms it causes to children,
				by promoting their chemical and surgical mutilation, and to women, by depriving them of their dignity, safety, well-being, and opportunities.
				This page does not reflect biological reality and therefore the Administration and this Department rejects it.`;
            }
            if (3 === bannerVersion) {
                text = `Per a court order, HHS is required to restore this website as of 11:59PM ET, February 14, 2025.
				Any information on this page promoting gender ideology is extremely inaccurate and disconnected from the immutable biological reality
				that there are two sexes, male and female. The Trump Administration rejects gender ideology and condemns the harms it causes to children,
				by promoting their chemical and surgical mutilation, and to women, by depriving them of their dignity, safety, well-being, and opportunities.
				This page does not reflect biological reality and therefore the Administration and this Department rejects it.`;
            }

            const banner = `
				<div class="cdc-banner2025" data-banner="${bannerVersion}">
					${text}
				</div>
			`;

            if ($('html.cdc-page-type--2024home').length) {
                $('.official-notice').after(`<div style="padding-left:1rem;padding-right:1rem;">${banner}</div>`);
            } else if (4 === tp) {
                $('main').prepend(`${banner}`);
            } else {
                $('.cdc-page-title:first').before(`<div class="cdc-page-offset">${banner}</div>`);
            }
        }

        $.ajax({
            url: 'https://www.cdc.gov/config/banner.txt?v2',
            method: 'get'
        }).then(doc => {
            const checks = String(doc).trim().split(/\s+/);
            let bannerVersion = 1;
            for (let i in checks) {
                let check = String(checks[i]).trim().toLowerCase();
                if (check.match(/^\d+$/)) {
                    bannerVersion = parseInt(check);
                    continue;
                }
                if (0 === path.indexOf(check) || 0 === url.indexOf(check)) {
                    // bannerversion can be 0 for up top skips
                    if (bannerVersion) {
                        addBanner(bannerVersion);
                    }
                    break;
                }
            }
        })
    });
}