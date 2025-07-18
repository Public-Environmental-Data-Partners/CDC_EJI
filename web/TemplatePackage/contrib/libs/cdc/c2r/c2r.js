import {
    createC2pa
} from '/TemplatePackage/contrib/libs/c2pa/latest/c2pa.esm.min.js';

(async () => {
    const c2pa = await createC2pa({
        wasmSrc: '/TemplatePackage/contrib/libs/c2pa/latest/toolkit_bg.wasm',
        workerSrc: '/TemplatePackage/contrib/libs/c2pa/latest/c2pa.worker.min.js',
    });

    const DEBUG = !!window.location ? .search ? .includes('cdcdebug');

    // expose as recallable method
    window.cdcc2paCheck = () => {
        Array.from(document.getElementsByTagName('img')).forEach(async (image) => {
            // skip images in page headers, footers, or non-indexed content, or images already checked
            if (image ? .closest('header, footer, .noindex') || image.hasOwnProperty('c2pa') || !image.src) {
                return;
            }
            // skip SVGs
            if (image.src.match(/\.(svg)$/i)) {
                return;
            }
            // Get a manifest store for the image
            let manifestStore = null;
            image.c2pa = false;
            try {
                let manifest = await c2pa.read(image);
                manifestStore = manifest.manifestStore;
            } catch (e) {
                DEBUG && console.error(`C2R: failed checking image:`, image, e);
                return;
            }
            const manifestFlat = JSON.stringify(manifestStore ? .activeManifest ? .assertions ? .data || {});
            const manifestCheck = manifestFlat.includes('cv.iptc.org/newscodes/digitalsourcetype/compositeWithTrainedAlgorithmicMedia') ||
                manifestFlat.includes('cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia');

            DEBUG && console.info(`C2R: ${manifestCheck?'Y':'n'}`, image, manifestStore);
            if (manifestStore && manifestCheck) {
                // dispatch event and flag to avoid retriggering
                image.dispatchEvent(new CustomEvent('cdc-image-c2r', {
                    detail: manifestStore,
                    bubbles: true
                }));
                image.c2pa = true;
            }
        });
    }
    window.cdcc2paCheck();

})();