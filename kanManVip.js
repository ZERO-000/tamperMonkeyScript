// ==UserScript==
// @name         kanManHua vip 
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       DEREKZ
// @match        https://www.kanman.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kanman.com
// @grant        GM_xmlhttpRequest
// @grant       GM_addStyle
// ==/UserScript==

(function () {
    'use strict';

    // https://www.kanman.com/api/getchapterinfov2?product_id=1&productname=kmh&platformname=pc&comic_id=5471&chapter_newid=5&isWebp=1&quality=middle

    const urlPathName = window.location.pathname.split('.', 1)[0]
    const comic_id = urlPathName.split('/')[1]
    const chapter_newid = urlPathName.split('/')[2]
    console.log(comic_id, chapter_newid)
    const nowPageUrl = `https://www.kanman.com/api/getchapterinfov2?product_id=1&productname=kmh&platformname=pc&comic_id=${comic_id}&chapter_newid=${chapter_newid}&isWebp=1&quality=middle`
    const getChapterData = (url) => {
        const promise = new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                header: {
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
                },
                onload: (response) => {
                    const result = JSON.parse(response.responseText)
                    const data = result.data
                    resolve(data)
                }
            })
        })
        return promise
    }
    console.log(nowPageUrl)

    // 获取数据加载在dom里面
    getChapterData(nowPageUrl).then((res) => {
        const comicUrl = res.current_chapter.chapter_img_list
        const nextComicUrl = res.next_chapter.chapter_img_list
        const swiperBox = document.querySelectorAll('.acgn-reader-chapter__swiper-box')
        swiperBox.forEach((element, index) => {
            element.innerHTML = `<img src="${comicUrl[index]}">`
        })
    })

    // 监听 url 发生改变
    window.addEventListener('popstate', function() {
        console.log(window.location.pathname)
    }) 
    GM_addStyle(`
        .layui-layer-shade {
            z-index: -1 !important;
            display: none !important
        }
        #layui-layer1 {
            z-index: -1 !important;
            display: none !important
        }
    `)
})();