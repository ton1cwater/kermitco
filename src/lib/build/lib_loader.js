let filename_list = ["async", "cloak", "cookie", "encryption", "firebase", "random", "ui"];

for (let filename of filename_list) {
    let script = document.createElement("script");
    script.src = "./lib/" + filename + ".js";
    document.body.appendChild(script);
}
