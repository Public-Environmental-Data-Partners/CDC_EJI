(function () {
    const o = document.createElement("link").relList;
    if (o && o.supports && o.supports("modulepreload")) return;
    for (const e of document.querySelectorAll('link[rel="modulepreload"]')) s(e);
    new MutationObserver(e => {
        for (const t of e)
            if (t.type === "childList")
                for (const c of t.addedNodes) c.tagName === "LINK" && c.rel === "modulepreload" && s(c)
    }).observe(document, {
        childList: !0,
        subtree: !0
    });

    function n(e) {
        const t = {};
        return e.integrity && (t.integrity = e.integrity), e.referrerPolicy && (t.referrerPolicy = e.referrerPolicy), e.crossOrigin === "use-credentials" ? t.credentials = "include" : e.crossOrigin === "anonymous" ? t.credentials = "omit" : t.credentials = "same-origin", t
    }

    function s(e) {
        if (e.ep) return;
        e.ep = !0;
        const t = n(e);
        fetch(e.href, t)
    }
})();
const l = () => {
        document.getElementById("go").addEventListener("click", r => {
            u()
        }), a()
    },
    a = async () => {
        try {
            let [r] = await Promise.all([fetch("content/json/states.json").then(n => n.json())]), o = r.states;
            i(o)
        } catch (r) {
            console.error("Error fetching data", r)
        }
    }, i = r => {
        r.forEach(o => {
            const n = document.createElement("option");
            n.text = o.name, n.value = o.id, n.setAttribute("data-abbr", o.abbr), document.getElementById("stateSelect").add(n)
        })
    }, d = () => document.querySelector('input[name="filetype"]:checked').value.replace(/\s+/g, ""), u = () => {
        const r = document.getElementById("yearSelect").value,
            o = d();
        if (document.getElementById("stateSelect").value == "NA") alert("Please select geography first");
        else {
            let n = document.getElementById("stateSelect").selectedOptions[0].text;
            n = n.replace(/\s+/g, "_");
            const s = o == "DBS" ? "GDB" : "CSV",
                e = `EJI_${r}_${n}_${s}.zip`,
                t = n === 'United_States' ? `https://github.com/oedp/cdc-ej-index/raw/refs/heads/main/${r}/${e}` : `https://github.com/oedp/cdc-ej-index/raw/refs/heads/main/${r}/By%20State/${e}`;
            console.log(t), window.open(t, "_blank")
        }
    };
l();
