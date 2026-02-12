const Cloak = {
    open: function(settings) {
        var a=window.open();
        var b=a.document.createElement("iframe");
        var c=a.document.createElement("link");
        c.rel="icon";
        c.href=Cloak.undef(settings.favicon, "");
        c.type="image/x-icon";
        a.document.head.appendChild(c);
        b.style.width="100%";
        b.style.height="100%";
        b.style.border="none";
        b.src=Cloak.undef(settings.url, "");
        a.document.body.appendChild(b);
        a.document.title=Cloak.undef(settings.title, "");
        a.document.body.style.margin="0px";
    },
    undef: (a,b) => a === undefined ? b : a,
}
