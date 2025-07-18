/**
react-dynamic-embed.js - Code that embeds a react project dynamically from same or different origin
 * ```html
    <script src="react-dynamic-embed.js?source=path/to/asset.json" src-dev="?source=path/to/asset.json"/>
 * ```
 * ```json
    [
        { "id": "file_0", "nodename": "link", "href": "manifest.json", "rel": "manifest" },
        { "id": "file_1", "nodename": "script", "src": "main.js" },
    ]
 * If you add different sources to the script tag you can switch them using the "use" query string parameter in the url
 * for example if the code is embedded on this page https://www.site.com/page
 * and you add the following query string https://www.site.com/page?use=dev
 * the script will use the src-dev attribute
 */
// const addSpinner = function () {
// 	document.body.classList.add("dynamic-loading");

// 	var styles = `body.dynamic-loading #root{background:#f1f1f1;min-height:100vh;position:relative}body.dynamic-loading #root:before{content:'';background-image:url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path opacity="1" fill="%231E3050" d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z"/></svg>');background-repeat:no-repeat;width:40px;height:40px;display:block;background-size:contain;-webkit-transform:translateZ(0);-ms-transform:translateZ(0);transform:translateZ(0);-webkit-animation:1.1s linear infinite load8;animation:1.1s linear infinite load8;position:absolute;left:calc(50% - 20px);top:calc(50% - 20px)}@-webkit-keyframes load8{0%{-webkit-transform:rotate(0);transform:rotate(0)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes load8{0%{-webkit-transform:rotate(0);transform:rotate(0)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}`;

// 	var styleSheet = document.createElement("style");
// 	styleSheet.innerText = styles;
// 	document.head.appendChild(styleSheet);
// };
// const clearSpinner = function () {
// 	document.body.classList.remove("dynamic-loading");
// };
const thisScript = document.currentScript;

const getSearchParams = function (url) {
	if (url.indexOf("?") === -1) return {};
	var search = url.substring(url.indexOf("?") + 1);
	return Object.fromEntries(new URLSearchParams(search));
};

const getSourceParams = function () {
	const localParams = getSearchParams(window.location.href);	
	let useAltEnv = localParams.use ? thisScript.getAttribute("src-" + localParams.use) : false;
	if (localParams.use === "qa" && localParams.ticket) {
		useAltEnv = useAltEnv.replace("ticketId", localParams.ticket);
	}
	const scriptPath = useAltEnv || decodeURIComponent(thisScript.src);
	return getSearchParams(scriptPath);
};

const loadSourceFile = async function () {
	// if (!document.getElementById("root")) thisScript.insertAdjacentHTML("afterend", `<div id="root"></div>`);
	// addSpinner();
	var sourceParams = getSourceParams();

	if (sourceParams?.source) {
		fetch(sourceParams.source + "?" + new Date().getTime())
			.then((res) => {
				return res.json();
			})
			.then((json) => {
				embedExternalReactApp(json, sourceParams.path || "");
			})
			.catch((err) => {
				console.log(err);
			});
	}
};
/**
     * Convert an object to a dom element
     * @param {Object} node The objects keys will be set as the node's attributes, there must be a "nodename" key present. For a file with a manifest.json href, the "rel" key is automatically added and set to "manifest"
        ex:
        { nodename: 'link', href: '2.fe017264.chunk.css' },
        { nodename: 'script', src: 'main.c0389ec4.chunk.js' }
     */
const convertObjectToDomElement = (node) => {
	if (node.nodename === "link") node.rel = node.rel || "stylesheet";
	if (node?.id && document.querySelectorAll(`#` + node.id).length) return;
	const element = document.createElement(node.nodename);
	const keys = Object.keys(node).filter((k) => k !== "nodename");
	for (var attribute of keys) element[attribute] = node[attribute];
	return element;
};
/**
 * Convert schema to dom elements and append to the page
 * @param {Array} schema array of objects that can be converted to dom elements
 */
const injectAppDom = function (schema) {
	for (var node of schema) {
		const element = convertObjectToDomElement(node);
		if(element) document.body.appendChild(element);
	}
};
/**
 * specify a list of files needed to run react app and their host url
 * @param {Array} schema Array of App dependencies
 * @param {String} root
 */
const embedExternalReactApp = function (schema, root = "") {
	injectAppDom(schema);
	// clearSpinner();
};
document.addEventListener("DOMContentLoaded", function() {
	loadSourceFile();
});

