export const config = {
    endpoints: {
        njs: "https://appdev.kbase.us/services/njs_wrapper",
        ujs: "https://appdev.kbase.us/services/userandjobstate",
        ws: "https://appdev.kbase.us/services/ws",                   // workspace service
        ftpApi: "http://kbase.us/services/kb-ftp-api/v0"
    },
    loginUrl: "https://narrative.kbase.us/#login",
    contactUrl: "http://kbase.us/contact-us/",
    // true: token will be parsed from cookie
    // false: token be parsed from app/dev-token.ts and stored in cookie
    productionMode: true
}