// i was stupid and obfuscated this, then deobfuscated.
// it should make sense though
// it turned my awaits into promises!!! >:(
// literally everything except random is asynchronous
/*

documentation for firebase

db.setup(project_name)
    if not setup and try to it will
    silently fail and log in the console
    that it failed.

db.get_from_db(key)
    retrieves the value of something from
    firebase. if theres nothing there, will
    return undefined

db.set_in_db(key, value)
    stores a value in firebase. pretty self-explanatory

db.create_key
    don't worry about it. its just there to make
    my life easier

*/

const db = {
    initialized: false,
    setup: e => db.initialized ? (console.log("firebase already initialized."), Promise.resolve()) : new Promise(((i, r) => {
        const t = document.createElement("script");
        t.src = "https://static1.codehs.com/cdn/chsfirebase/latest/chsfirebase.min.js", document.head.appendChild(t), t.onload = () => {
            try {
                firebase.initialize({
                    projectName: e
                }), db.initialized = true, console.log("firebase project " + e + " initialized"), i()
            } catch (e) {
                r(e)
            }
        }, t.onerror = () => r("failed to load firebase script")
    })),
    create_key: e => {
        if (!db.initialized) return void console.log("firebase project not initialized");
        const i = firebase.database().ref(e);
        return console.log("created " + e), i
    },
    set_in_db: (e, i) => db.initialized ? new Promise(((r, t) => {
        i = JSON.stringify(i);
        db.create_key(e).set(i, (o => {
            o ? (console.error("error setting value in firebase:", o), t(o)) : (console.log("set '" + JSON.stringify(i) + "' as '" + e + "' in firebase."), r())
        }))
    })) : (console.log("firebase project not initialized"), Promise.reject("firebase project not initialized")),
    get_from_db: async (e, p=false) => {
        if (!db.initialized) return Promise.reject("firebase project not initialized");
        if (!e) return Promise.reject("enter valid key.");
        try {
            const i = await new Promise(((i, r) => {
                db.create_key(e).on("value", (e => {
                    e ? i(e) : r("no data stored as key.")
                }))
            }));
            
            if (p) {
                i = JSON.parse(i);
            }
            
            return console.log("value retrieved for '" + e + "' is '" + JSON.stringify(i) + "'"), i
        } catch (e) {
            return "no data stored as key." === e ? console.log(e) : console.error("error retrieving data: " + e), null
        }
    }
};
