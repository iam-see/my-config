// ==UserScript==
// @name         浏览器搜索扩展工具
// @version      1.2.0
// @namespace    http://tampermonkey.net/
// @description  划词搜索,一键跳转哔哩哔哩，谷歌，百度等。注：第一个图标为打开网址的按钮，仅当选中文本为链接时可用。
// @author       Levy258
// @match        http://*/*
// @include      https://*/*
// @include      file:///*
// @run-at document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @license      GPL3.0
// ==/UserScript==

(function () {
    'use strict';
    var keyword = {
        beforePopup: function (popup) {
            var text = window.getSelection().toString().trim();
            GM_setValue('search', text);
            popup(text);
        },
        beforeCustom: function (custom) {
            var text = GM_getValue('search');
            GM_setValue('search', '');
            custom(text);
        },

    };

    var iconArray = [
        {
            name: '打开',
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABHNCSVQICAgIfAhkiAAAAAFzUkdCAK7OHOkAAAAEZ0FNQQAAsY8L/GEFAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAjlJREFUSEvtlruuqUEUx//ut4bOZUsEjUbrEi+gEOLyBN5Aoab0EhKVitAqdKLRSEgkmydACFvcfceM+eJ89oedfXBOss+vmZk1M2vNmpm1ZiTcEfwFpKx8OT/P8EPOOJVKIZ/PQ6vVMskZon632+H9/R16vZ5JATkrP7FcLpHNZtHv9yGRSJj0zHQ6RaFQgNlsxnw+h0wmg1R62kAy3mAwQKFQ0PZ4PEan00EgEKBtgqjHxKjL5aIKttstkwoZjUbodrtwOBy0vVqt6HiyALlcjmg0Sr0kxieTCYrFIrxeLx1LEPU4k8lQJW63G+l0miq9ZL1ew2QysRagVqtZDYjFYtRDsgidTke3+xPE40vi8ThnsVi4RqPBJF8nHA5zx13gjEYjNxgMuGAwyL29vXHNZpONOCF6q/kz3Ww2tPwqkUiEerpYLFAul2G32/Hx8cF6hdwMp+PCWO0+vFFiqFQqwefzsR5xHhLHyWQS7XabelqtVuH3+1kPsN/vBSXPQwwfDgfMZjNUKhV4PB4mPWG1WjEcDmGz2ZiEcTpqIYlEgl6uer3OJH/GMSpY7cxDPL6HSqVitTNPM1yr1Wj2CoVCTCLkaYZJxtJoNILE8jtP3WqSu/mccMlLzliMf9PwtW36Cvfmiho+hhktlUolLb8DP5fXdYnos0iSe6vVQi6Xu/os3oLcZDKX3Gz+vb7k2x+BexCjRHWv1xMNqat/LuIl+RBc+/rcgqh0Op10/rU4/v+hfxk/zTDwCyMemuJBYiocAAAAAElFTkSuQmCC',
            host: [''],
            popup: function (text) {
                if(text.indexOf("http://")==0||text.indexOf("https://")==0)
                window.open(text, "_blank");
                else window.open("http://"+text, "_blank");
            }

        },
              {

            name: '哔哩哔哩',
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAsUlEQVRYw+2XQRKAIAhFwfH+h+hSHYdWzjQTBYj2XciS/nxfCGYsIoSMysep5TUqDnq7PErSMK2NAHiNQ3saBbAWCDfUG4C13+LMmZ41QZ/V870CiFmUBoA8CKSnCYdG/XgWPXjMt9WSvVPQE6pn8QpnQSzdAy3U+R2lh1dgA2wAzxREz4WQHl6BDaABzLwfPLyLVzhjcaLvKfjlprRED8z8/lvBrQIICCYiYvTfMbwHLj/GILhJ6T2wAAAAAElFTkSuQmCC',
            host: ['www.bilibili.com'],
            popup: function (text) {
                open('https://search.bilibili.com/live?keyword=' + encodeURIComponent(text));
            }
        },
        {
            name: '谷歌',
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAARBSURBVEhL7ZVbaBxVGMf/c9vJ7qZWm91tgmgasUXU0igNVB+0WF+kXmoqfRMFrX0s9KGlWhAEX3wwVEQffFAQsdqIVSlqRYNorLRFWluo2lDUSmrVbC57yc7Ozf83M9tsJrub1UB98Qdnzsy5fP/zfec7ZxSf4D9Ajeorzv/CV4x/lFz26ZMof3AQ9skTcH8fBzhT6+5Bon89klu2wVjbH41cnLaE3b/+wPTO7bAv/Aw1vQwwNM5kkamOw1KFVyhC7+3D1S+/Di2TjWY2Z1Fh69g3mN61A+o1XfA1DYriB3pwPQqzKGrY5inwSwWgaiE3eiac3IKWwva5HzH5+FZo2ZXwFRr2vNC47UDNraTTGtzfLjACOhTDZL+L7GfHuJDIQAtaCv95751Q0h1MQRU+Q+qXZrBs1z4k7x+MRoSUh99C8ZUh5D4/TottqJKmws7pFzC19116sQLQbca8gszhr6DoejRiaTQX/joDJeGg8OZNqIxayLx3EHrfjVHv0mko7NsTcEYobGahpMqwTg0g9eRI1DvHayNVpE3ufWRCnswz5gNzzwUyVynY3G8EfXEaC09+CefERnqc5d7OQFu9G+r1z0W9c9yyp4gsT5dYCIxElqRyKLw8peCTPemwMUbjm8st8iFJIhZpATlpXUDaBFIJ1h1K4HknS6r2zpz0Gu9iQGNho4sPmeQzoVWo1g9Bc5x80cNkyUe+xFrey364XE71WGQhcWprCULt8XyKQA3ft+EcScAwl/Orip0zd2P/gx+HnXX8dNENLjGxpfIYmdzOh18sByG2HB+39WoYejQZDo6QnVU4tqHHimLA6FyFCVfFxolBHC4kMTz2adQ7x5oeDX05DTewrMqqOPWrC40WJbksnsANq7mqGLWUuiwcz7HzvS9h/fhdqNJKj9mBfUeHMDr+XdS7kIsTwLPDFveYH4xzpepjcGB+RtdrXM5ql/mv8Qqs574PtyM/O4WEZnASb7LZPDZddweeunUb1natYWRUjE3/gnfG3seBozaundrNC6aCQsXB5tsNPPMQs68Ol/e7JiEhLYVd3r3r3t6CtJ6EoercSx+WW0XZqcD2GEui8y9laiY6TBuq3Q3j3H6YuoYje+fvrVCvMe8cO7yP9diVWKyWsenQY5h1LHQaKc5gI2co8sLalxuDePxTTdt5rEhkMLr1wILzErc9T1hWFGRcXYbXeP74q3jj7CEk6HlCTXBMeFQkKhWvCtt18MTNj+DpgR1Bez1yakSmPqLzhAVZWXB2G4gLH53/At9e+h7jpUuB8z3pHDZ0r8MDffeEA2KIqJR4JBcICzb/t5IEzcTbRQRdFqPBH62hsCCeS5dhNL7kF8O27WDb4p7WaCosSFeVBjR63sxAHJsLFk8TXLAIN6OlcA0ZIh6EKME21IxKn4STL8G3RKiVYI22hONI9su0mkD8/LfDvxJeOsDfm07+Nc7On9MAAAAASUVORK5CYII=',
            host: ['www.google.com'],
            popup: function (text) {
                open('https://www.google.com/search?q=' + encodeURIComponent(text));
            }
        },
        {
            name: '百度搜索',
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAARRSURBVEhLzZbri5ZVFMX7C4KIMrtoWZalVnaP7h+K8FMkUhB96EJ0gyjUTC0dzczsYpk0mN2dRMpRKq0ou4mYTuIIWiZW5niZspxMs1HT1fq1zzPzvPd3IKgFh/d5zz7nrLP3Xvucc5j+I/z/iZd/L90zT5r+aeoog7370kcdqIv4sw3ScWOkAROlPuOkm15JhoS2DmnoTOmsx6SJi1NnDdRFzKKDHpXOfVw6Z4p07EPSmi1h290pnTlZOsObgpiNTf4gbNVQFzFEEEJMO3WCQ/5J2EY2x//MNsTjiE4t1E2cLUw7rUF6NhEPdCTOtqd5e5+x0rrtYa+Euoj7Onx5j/vbw8alYSuOBt9HjQpbNZQQz18tDZvlEM7vVuktr4eXLEooez0odewN20XTnFvnOCMe4HG3zQlbNRQQN7dKve3BwEmRt34PS4fc3/FHLIrnJziML3wR4wGe4/XpFlf/8RaZ5yK4WiggvmaGNDipl4aX978dtj1ebOEaqbUt/udB/91zpQmLgrTzQETpekfu5lel9e1pYA5dxL/skU7xjvP5QjS0nuKq6aEDnKD2aW07kzGhi3j7riiDjDQjpkaL0bk/6rjdc4qxcUeQ5h0gbaMWpAEJXcS7/ozcDsmVBqRXevd5jHs3DhMWw5MbX5L+OpiMRsumsOWJGU/Y8yjI8b0+i09+JJSLt0Rg9rJkNG63Wk+y4LBlCkcHVzydBhgtP5YnHvZiGpBQQHzIEh4+2+TONRuY9H4yGE0rQ9VEhJYtzC+hvaMpxq3bVqoVFH+XxZdHAXElkM9+3ghn8XlTpfPdisn7OhKz0qFymSPA5kkdpMc7ciudgjxqEi/dGJMhhXy1y2nH7shv3iu+qfHFa2PemHd8kLzh9DgSS76NvjyqEhNeckrOOByOHCmt2iztpPTcR34RIMRZvtHFvFVpgSqoSDzWO8YDvBy9UFrgU23OCpP6FNv2W5DM/DzUSr1e8IQ09cPIZa/R3bdXJZQlbvBlfqI9pWWh2+LLfu3W+N7sw2CQ8wem+O5FXJcnZS9zatgsc3mxVEIJ8YafYyLCGJ5KYG5LhPCIEZFfPObiBw0+JiG+9Kn4//E3URH/CM5V8PLy6C9GCfEzDhELIaiG96Lvvrfi1iH0Wagz4vEeQ/kUE5N38n/Jk9FfjBJiwgwJobzVqgQs3tt5O/yBbo+zUFPrx9iGhyBPzEFzoXNfDiXEr30ZNchCKDo73HnwLUr5/un38D5Dq+v86/TiWLK+m5h7+mLf1+VQQsxlQfmwW9pgT270/bvVXmbervjBm/LiN/ic5qRiI8xr92+Tlc98iKn1O99MCxehhBhQJpw2nLE0xIa4CCnPGhpRweuj/RohDXwjpuycZh4R+863VTmUJQbNfgJd1yhd/Vw8EPjFwxF+VVLP2KntaR+F+qllNsdDj01f+7z0lS+MSqhI3FMc9AXD1brpV2mfXyC18K8R9wzS35XpXuCn7a8LAAAAAElFTkSuQmCC',
            host: ['www.baidu.com'],
            popup: function (text) {
                open('https://www.baidu.com/s?wd=' + encodeURIComponent(text));
            }
        },
        /*
        {
            name: '百度翻译',
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAUsSURBVEhLxVdpbFRlFJ2YiFCRpSJQEDUxLijESGLcEiMxGDVxC4mJifhDEiEmKjGgqChaECibsiiKUimLFOLSFgSKsmglti7IIkgEClhDKyoW5s1bZt6b4znfm9dOh2moUuNNzmTmW+75vnvPve9NDBlrPBVgzFoPg+YkUDjdQp8ZiU6BfMnnmCoPjVaQYQMMcdmOJGLj4ygotjqVNIJ8yrc4xGWIG+OBGci34b+AuBTd2FiGQKfJXXDhdMHKIPyduyYftK7XNAs9XssfPXGJM3ZJnpxqs8Z6crMcyJF+C/ouaC6av2Cqhe4ZdKPjy19P4JZ3bRTNTJg12b7lQ5yxXFKhNx1fMS+BRz9yMXGThwc+cDCATopmJXDVfIJzQxbaGLbIxs0kGF7q4K5lDu5d4eBBrl3CPB78M8C49S4GcI/8ZfsXZyx7IIJuMKLMRv2JtBHCxp9TuJJkA+mkdEcK6/ansOGAj/I9Kazn3EZ+rz6QQvVBHwf+aFVuk5XGyFUOepMoN1XtEt+x1Ma+46GTyp9S5pbdpyZMBEpqPDP+4d4Uo+LgsQoXI8sdPL3ewzGKVdbspLH4uyRuZUT6zOggcRTqUQz1s9Ue7mf4dFuNd1VZTIrj7W+SaGgOcM9yG7GJFvoxFat2pwyp66dR8mUS/WdaOH/K6aRCC7Em5TiCRNP1VQvnvhJuztaCxNWH6+tPBOZmc7cnUfZDSOrzwvNrPSMgRS7akwtDLFKVTdEsnbwtioiLGKrCzLpoYwEPM5hC+4W3jghTQRoL65LmoLGXwwNL1YXGfx5iTQ5ZYMPy0jhKRwZ/BThEZR5jsT9R5ZobR5t1k9iLcTy8xoHnG96MpdFwMo2KfT5e2uzhvpUOrubhCqbEDUc2uSHuxcHBC3T6NHY1Bth5LMCepgCn3FDVkz4nMcMbEV7PMqo50spYvNXDzK/CVhiZxzyf5P44L6N0qK6VvjbEUYdSwfcrCSfUBFb/GObthU2u6TjD3rKx+VBIeIQRmUCFX8NI1TX4GPWxixsX2y17Imsm+UOrWVI8uDjaEEfk2cIaNJsqZZ3Knqt2TeOYV5vEk+tcDJzDDkXhSeF9SyyzRraW9R2bEGdu4xjBhvLG10ncucw2HS07VW2IsyHyS6nK8qwb9+TmLlR4lwyhxHUev/el8CLbUu/j9lIbo1nX41jTQxkNVUUuqdBhYuVYRJO3eLBNOpX/UAPt2e4mH7ctaZvbCP+I2KSB3Wv8Rg+PV7E3U7UjljpmjaxsJ0M9ngKcGA9BIeqhcVY31pjqUc1DQlOoVad6CBjj5VfsSnG/ZUroujdtIza1zIupF+3/VznuwRzL2VOfuqZ8irexhNiz1TAi2/+7j/e+T+IT9vDtRwMcpvKPx9MYXenSbzuqzkY+4u683fD3bdSydHaxxr/91UfNUR9b68M1sr2/BZjN9jmbNT3tC4/1H0IPElVJdtttl/gyEq+JiD8Lc6zwqr7lRGXUjb/7ZcopzVAvqmOOmVspX5AYhdxeL7RPPLe1jp9no9DGKMeaFxT+a1kykS2juM6ZfLqC8yEvsUj6s4vdvdzBMxs83ESRhN2tdY2+q/8O5ZtIZBVsIB0mzg1BBI2rN6tZqA5zy8EQ89Y3vBMSbzvs4xHmUunIXpcP8p33Za8jELH2DWS+9RSS4pX3M/nSvHnZa+/1tiOIyNWLw+fumf2IS/8qYubl+v94oVd+Wv7CGNnn33A2kE/5FkfLXxjzSdObxthKj+2tc8nlSz7H0LduGhrwN1fH/x1DJk9SAAAAAElFTkSuQmCC',
            host: ['fanyi.baidu.com'],
            popup: function (text) {
                open('https://fanyi.baidu.com/?aldtype=85&keyfrom=alading#auto/zh/' + encodeURIComponent(text));
            }
        },
        */
        {
            name: '火山翻译',
            image:'data:image/x-icon;base64,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',
            host: ['translate.volcengine.com'],
            popup: function (text) {
                open('https://translate.volcengine.com/translate?text=' + encodeURIComponent(text));
            }
        },
        {
          name: '掘金',
          image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAACXBIWXMAAC4jAAAuIwF4pT92AAAGWWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTA0LTEyVDE3OjI3OjQ3KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wNC0xMlQxNzozMTozMCswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0wNC0xMlQxNzozMTozMCswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDphZGViNWZhZi00MjBhLWVkNGUtOWNhYS04NmJjM2UxYjMzNjYiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpjY2FmMzU2ZS04ZmI4LTBkNDctOWNjMC1mYjI3OTc5OThlZDQiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo3NGMxNDFhZS00NmQ3LTBlNGUtYWZkNy0zZDU4MTBkZTEyOTMiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjc0YzE0MWFlLTQ2ZDctMGU0ZS1hZmQ3LTNkNTgxMGRlMTI5MyIgc3RFdnQ6d2hlbj0iMjAyMC0wNC0xMlQxNzoyNzo0NyswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjb252ZXJ0ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmFkZWI1ZmFmLTQyMGEtZWQ0ZS05Y2FhLTg2YmMzZTFiMzM2NiIgc3RFdnQ6d2hlbj0iMjAyMC0wNC0xMlQxNzozMTozMCswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PiEgaXQAAA1iSURBVHic7Z17uBVVGYffo0eJiwGlWCko4iVCoRIf61ET7ZGLgSgKCiqEPBwEJPDxkoV4Bcw7UIAhCCJxFQUMtdTU4snKtBteykSIxNTyGiLi8fTH7+w4HPbZe8+318yaPTPvP8o+s2Z/e/ZvZn3ru6xdVVdXR0Z62cO3ARl+yQSQcjIBpJxMACknE0DKyQSQcjIBpJxMACknE0DKyQSQcjIBpJxMACknE0DKyQSQcqpz/1M1zqcZXjgcuApYB9zh2ZbIqfuh/ltd+LDEciIwG+gMDASOAC4DPvZplA/SNgVUA98BHkBfPsDewATgQaCjH7P8kSYBtAFmANOBffL8/RTgYeCkCG3yTloE0AVYAowuctzhwH1ATegWxYQ0CGAgsBroXeLxbYBZwI+BfUOyKTYkWQBVwDXAAqBTwLF7oqfAfcCXnFoVM5IqgP2Au4GrgRZlnOcE4CGgrwuj4kgSBfAVdOee7+h8HYD7gSvQiiFRJE0AQ4GfAsc7Pm81cAN6quzv+NxeSZoA3iPcz/Qh8EGI54+cpAlgFfBN4FHH592OgkWjgPcdn9srSRMAwPPAABTq/cTB+TYAp6MA0kcOzhcrkigA0F06BrgUTQtWfgH0RxHCRJJUAeS4HTgXeNEwdhoKIq13aVDcSLoAQKuC/sDPSzx+G3ARenq8FZZRcSENAgD4G3AWyvsX8gteQf7DTKA2Aru8kxYBgPyC0cB3gXfy/P1nKOKX2Pk+H2kSQI5bgCHs9Atq618biFYQqSKtFUEPAZvRPP8sqhNIJWkVAMi7H4WCPKkljVNAQ1L95UMmgNQTFwFUAX18GxER3YCuvo3IEQcBtAaWoZq9aeQv2EwKA1B52hq06vCObwEcBTyCLkZrYDwSw0E+jQqBalRQsgh9toNQbcFEPDviPgVwJvryj2n0eh/UrZOU8uwvAPNQQUnzBq83ByYDc4F2HuwC/Ang+8AKmq6uORCt1S+MzKJw6I6aUIYWOGYYsByVskVO1AJoBywEpiDHrxDNUE5/Nh7vkDIYhOb7r5Zw7Imo7jByvyBKARyD7uqgxZoXokqfI10bFBIt0ON+Pnr8l0rOL7iKCItPoxRAB9R5Y+HrKJ37LXfmhMIB6HF+BbZy9OboGkW2g3eUAlgJnAr8yTj+8+iROonyav3D4njUYGoV6XsoU3kesMOVUcWI2gf4FaqvW2YcvydwHWrbOsCRTS64EDl71gDPS8gZvMmZRSXiYxWwERiO5jprLP485Bc0XkJGTWuUSZyJegotrEUVS6vcmBQMX8vAbcD1KC//L+M5uqNyrwtcGRWQQ9FSdhz26/gjdA1ecGVUUHxHAu9DfsFTxvHtUCDlJqL1C04FHkN7Clh4BxiLxFNO1XLZ+BYAwB/QBb3bOL4Kbe+ygPB3+KhCO4zci1Y1Fp5DMYJZrowqhzgIAHRHjEDdN9bWq4FoHu3pxKLd2Q+FdKeza0g3CKtR3eEjrowql7gIAFSbNx1doA3Gc3QFlgIXuzKqnu4ogze8jHNMQUGwjS4MckWcBJDjcaAHWjJaaIuKPGcBrRzYMxh56l8zjn8XlaRPIoZ9hXEUAKhgsxcwB1s/3h6oBHwl9uhjC7RUXYw9F7EeOLnejlj+Pl9cBQBaKo5CPX7/Np6jJ5p3Tws4rgMS37XG9wUtEXujquPYEmcB5JgHnIG8ZwtfBH6Cii9K+bw9UGbuXOP7fYTKzc8DXjWeIzJKFcBE4JwwDSnCOlQostw4vhUKPM0HPlPguAvQnVtKCjcfW9Bq5Fb8tZJ3RLGRzsUOhOICaI3uwMkoj/8D7EugctmMCiuuwxZCrqof/xi7F1+0Am5Gj33r1nBPovl+jXG8C05GLW4j6v9btNC2kAC6okhdLtS6F8pWLQTal2Wmne1o568a4HXjOb6M+v8G1P/7YPQ5L0XJpqB8gm6S04G/Gm0ql2oUVVwDHFb/WnuUdLuYAp+rKQGchubBk/P87Szk1fqs2VtYb8evjePboQLN6SiqZw3p/gdd4BryN5xGQVuUU5gBtGz0t32A29CSuE2+wfkEcBla+hxS4E2PQXPlmGC2OmUduovvMo5vjsK6RxvHr0eFrTNwsxWNhe4o+jmqyHE16Ibu0vgPDQXQDs2BN7K7kvLxWXQH3Q58qoTjw+B1tN6fSIRFFGgK6YvmfV+ciZa43yjx+B71x/ekwZTQUABLgZEUL9ZsSDWK36/AHnApl4+Aqcj73hjye+1Ad/wAYFPI79UUzdBTeinBag5BW+Y+jIJswK4CWAO8bTSqLyqH6lXswBBZjbKKT4R0/tfQ1jHjUZDKBx1QNdRN2BtKlqMKJGBXAUxDjpW1OKETmmdcJ2KC8AJyYF33+z+F7vo5js8bhOPQ9R1mHF+HNs8eRhMCAG2LlrubLTRHXud85J364H00LY3BTfJlOZpvf+PgXFaGodWKNUD1Jio7u5ZGMZR8q4ANqGBhCvbf0Pk2UquvLtg61FAyCNsWcaDPfj26+K85sisozZB/Mwf4nPEcT6PdUx/I98em4gBbgStR/tuaiDkRPUl8hpAfRn7B6oDjNqMv/iq0P7APDkEd09/D1ihSB9yJElJ/aeqgYqHgRcgvsNbyH4CCNpPwt1R8BRVe3kJpKdl1KKq3OESbinEKcsrPMI7filYKNRTZ67CUZNCTaP5YaDRmLxS/D9oq5ZIP0AUZSuEq5LvQctJnCncsuvN3C9qUyMto6ru1lINLzQZuQmqahP2ReA7qDbRW1rhgEdAPFaI2ZDu68GOwl6mXS0sU0p2GgmwW1qLOpJKd+CD1ANtRVvB84J/B7Po/XdF8PJxgASeX/B6JYDkK7GxCS8dZ+Ns06gj0pY3Ftr6vRUvfwQRMSFkKQu5FjoW1Zq8dyp7diNLNPngVZTnHoi+/1H2Ew6AfunNLDek25g0UnBqPYdlrrQh6DvkF843jc7X8S1A61gdbkZf8Z0/vD/LwFxP8V81yPIuc9JlWA8opCXsb5Q4uQhfTQh/U3pWU7WBKpTX64qdir1y+H60SrE9ioPyawFqkvn7Ya/m7oPqCCWXaUikciap1BhvH1yLhDAX+Ua4xropCc7X8TxjHt0Vp5TuAT7sxKZYMQf7GscbxbyDhTAT+68Igl1XBm1GueTr2EPIoVMZkXQPHlWYoEXMP2ujCwjNoylzhyCbAfVn4DnYmYt40nqM38gsGFDuwQuiEvvirsV/ve1BI23mAKqy+gDvRF/i0cfzBqFv4Cip7R/OTUMmWdfevbWhLvZHo8e+cMBtD1qGl4krj+FbI2VmI/bHpiz1QnGE59t3N/o6EcwMhBqjC7gx6DTgbpZYtVTRVyOlZg714M2raonDuPOw9Bo+jANVaRzY1SRStYbUotTwCOYoWuqOLEYsNlgvQGQW3xpVxjrmoACWSbWOi7A1cQnmBi/1RMucG4vkr3rlGVGtd5LuowrkGe21mYKJuDn0GqXuBcfzeyDG8F3+p5XyMR1W6hxU7sAnWs/Nn7SJtI/fRHfwm8mrHY98Oph8KOvVwY5KZ1kjMt2GvgXwQ1WG6/sHrkvDVHv4xSl8OwR5CPgzFC0bgJ7XcDZWcDcN2HT9BDal98ddj4H1/gNXobrZumtQSOU03E21q+XS0MrEWt2xBc/3leN45xLcAQD/WeDZ6jFq5BIWQw95RvBoFZhZh3yYu12Mwz5VR5RAHAYC83stRCNmaWu6F7sreroxqRHu008hkSuudzMcy9PT4rSObyiYuAgDFC2ajmjbrT7h2RL3+F6MEjCuORdPVIGz+xlYUDBtCSCFdK3ESQI4nkWNkjYLlupPm4OaXRs5HTxbrT7psRI7ilfhrI2+SOAoAVMs/GD1urXHwoSheYA0hN0e9BAuxC+mXlJcPCZ24CgBU4DgJ3YHWx+YJKBsXtKHyUBS5vMT4vqCgzkD81hwWJc4CyLECFUL80Tj+QDQdTEVNKsXoiUq2+hvfbxuqkxxHzOb7fFSCAECFEL3RI93C3qgCdwGFQ8ijURNloe1xCrEJefkzsVdFRUqlCAC0HcxA1LBp3aBhCHLojmv0+r6oJnEW9kTTo6hqx2ePQWAqSQA5rkdtZi8bxx+NnLKa+n93Q4UbE8qw6WaUzLEuX71RqeVWa1C+fB5y9IKyP8pF9EI5haOMdryNklr3GMd7pxKfADleQkGjudh2CGuGQrLWL389ck4r9suHyhYAaKmYSy0X7IN3zCo038cmpGul0gWQYzZKKIVdRvUh2mdnEPbytliRFAGAvPD+2De4KsYWFJS6hmg3pQyVJAkA5BcMRokXl3n236H8hDUOEVuSJgDQ7/DlqpDLLa6sQ8Gjnuy+q0giSKIAcsxHBajW7qT3UdBpOKrYTSRJFgCowaI/KuQIwvPszEYmmqQLANSddAFy3krhEXZu25J40iAA0I7i16Jw7ZYmjqlFQaUB2CuVK460CCDHSnR3r2v0+lsofTsSRxsvVAppEwAotXwGOze+fBEFdmZ7s8gjVXV1sfxBy4yISOMTIKMBmQBSTiaAlJMJIOVkAkg5mQBSTiaAlJMJIOVkAkg5mQBSTiaAlJMJIOVkAkg5mQBSzv8AxZVugwXlHW0AAAAASUVORK5CYII=',
          host: ['juejin.im'],
          popup: function (text) {
              open('https://juejin.im/search?query=' + encodeURIComponent(text) + '&type=all');
          }
      },
      {
          name: 'github',
          image: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxOC4xLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiDQoJIHZpZXdCb3g9IjAgMCAzNiAzNiIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMzYgMzYiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGZpbGw9IiMxOTE3MTciIGQ9Ik0xOCwxLjRDOSwxLjQsMS43LDguNywxLjcsMTcuN2MwLDcuMiw0LjcsMTMuMywxMS4xLDE1LjUNCgljMC44LDAuMSwxLjEtMC40LDEuMS0wLjhjMC0wLjQsMC0xLjQsMC0yLjhjLTQuNSwxLTUuNS0yLjItNS41LTIuMmMtMC43LTEuOS0xLjgtMi40LTEuOC0yLjRjLTEuNS0xLDAuMS0xLDAuMS0xDQoJYzEuNiwwLjEsMi41LDEuNywyLjUsMS43YzEuNSwyLjUsMy44LDEuOCw0LjcsMS40YzAuMS0xLjEsMC42LTEuOCwxLTIuMmMtMy42LTAuNC03LjQtMS44LTcuNC04LjFjMC0xLjgsMC42LTMuMiwxLjctNC40DQoJYy0wLjItMC40LTAuNy0yLjEsMC4yLTQuM2MwLDAsMS40LTAuNCw0LjUsMS43YzEuMy0wLjQsMi43LTAuNSw0LjEtMC41YzEuNCwwLDIuOCwwLjIsNC4xLDAuNWMzLjEtMi4xLDQuNS0xLjcsNC41LTEuNw0KCWMwLjksMi4yLDAuMywzLjksMC4yLDQuM2MxLDEuMSwxLjcsMi42LDEuNyw0LjRjMCw2LjMtMy44LDcuNi03LjQsOGMwLjYsMC41LDEuMSwxLjUsMS4xLDNjMCwyLjIsMCwzLjksMCw0LjUNCgljMCwwLjQsMC4zLDAuOSwxLjEsMC44YzYuNS0yLjIsMTEuMS04LjMsMTEuMS0xNS41QzM0LjMsOC43LDI3LDEuNCwxOCwxLjR6Ii8+DQo8L3N2Zz4NCg==',
          host: ['github.com'],
          popup: function (text) {
              open('https://github.com/search?q=' + encodeURIComponent(text));
          }
      },
       {
          name: 'MDN',
          image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAABX1BMVEX///9HR0tTU1chICZGRUpDQkdEQ0gVFBrOzs/My80eHSNRUFT+/v4YFx0WFRvw8PE7Oj/29vb8/PwuLTLl5eZLSk8aGR6Uk5be3t8kIyh0c3b5+fkzMjhzcnaEhIeIh4pWVVrNzM68vL3Av8H5+fo/PkNnZmqvr7HQ0NF3d3p9fH83NjtjYmYjIierq601NDmfnqGOjpHr6+vX1tcnJiykpKZcW1+Qj5LFxcbW1tdsbG+1tLbg4ODY2NmgoKI8PEGYmJpYV1xSUlYxMDVQT1MbGiA/P0Sbm53S0tM8O0CsrK5xcHRpaGx5eHzj4+SxsbPs7OxgYGTCwcM2NTpOTVKpqKu5ubvy8vLt7e1/f4L6+vtIR0ynp6mDg4ZCQUaurq9MS1D09PTIyMleXmKKio23t7lHRkqrqqzT09T9/f2ysrTNzc5iYWVvbnJpaW0sKzC7u70pKC56eX3CwsQmJitiaC63AAABV0lEQVRIx+3VRVMDQRCG4Xc3sAOEEEhwEtzd3d3d3d3h/xeTymbn1lVcIXOaPjzVffh6BvXLQxL8DeCzbfvc7/e5ZbZtb/v9jgCW4OIJUtxyHs4gTQC78JjugalMKBZBRg68GrACwVsRbEDo24BNuEsVwQ58KQ8UHcKzCAL78GnAMpT4RDANRAxYg3clgnG4Vx6Y2YOoDIbh2oAJeHgTQY2e6NSAUUhXIiiD1SwPZOXCiQzqYU55wNL9skUQ1kGYNKAPCpUIGnQQ8g0YgQIZVEGr8sCWnihPBC3V0GzAAXQGRFAbC4IBl9CjRFAHlcoDHyHoFUF+UC+LAS+QkyGCcsgMG3ADQ0oE7VChPBBbvUERxIJQasCVXr1uEaTEg5AAx9CvRNARD4ILjtahUQZd8SC4IKr7NYmgzQ2CCxZhQImgyHGcgHtfsKxZx4kknirLGkt+KP8Q/ABoHVFTkXMUNgAAAABJRU5ErkJggg==',
          host: ['developer.mozilla.org/zh-CN/'],
          popup: function (text) {
              open('https://developer.mozilla.org/zh-CN/search?q=' + encodeURIComponent(text));
          }
      },
    ],
    hostCustomMap = {};
    iconArray.forEach(function (obj) {
        obj.host.forEach(function (host) {// 赋值DOM加载后的自定义方法Map
            hostCustomMap[host] = obj.custom;
        });
    });
    var text = GM_getValue('search');
    if (text && window.location.host in hostCustomMap) {
        keyword.beforeCustom(hostCustomMap[window.location.host]);
    }
    var icon = document.createElement('div');
    iconArray.forEach(function (obj) {
        var img = document.createElement('img');
        img.setAttribute('src', obj.image);
        img.setAttribute('alt', obj.name);
        img.setAttribute('title', obj.name);
        img.addEventListener('mouseup', function () {
                keyword.beforePopup(obj.popup);
        });
        img.setAttribute('style', '' +
            'cursor:pointer!important;' +
            'display:inline-block!important;' +
            'width:22px!important;' +//图标尺寸设置
            'height:22px!important;' +//图标尺寸设置
            'border:0!important;' +
            'background-color:rgba(255,255,255,1)!important;' +
            'padding:0!important;' +
            'margin:0!important;' +
            'margin-right:5px!important;' +
            '');
        icon.appendChild(img);
    });
    icon.setAttribute('style', '' +
        'display:none!important;' +
        'position:absolute!important;' +
        'padding:0!important;' +
        'margin:0!important;' +
        'font-size:13px!important;' +
        'text-align:left!important;' +
        'border:0!important;' +
        'background:transparent!important;' +
        'z-index:2147483647!important;' +
        '');
    // 添加到 DOM
    document.documentElement.appendChild(icon);
    // 鼠标事件：防止选中的文本消失
    document.addEventListener('mousedown', function (e) {
        if (e.target == icon || (e.target.parentNode && e.target.parentNode == icon)) {
            e.preventDefault();
        }
    });
    // 选中变化事件：
    document.addEventListener("selectionchange", function () {
        if (!window.getSelection().toString().trim()) {
            icon.style.display = 'none';
        }
    });
    // 鼠标事件
    document.addEventListener('mouseup', function (e) {
        if (e.target == icon || (e.target.parentNode && e.target.parentNode == icon)) {
            e.preventDefault();
            return;
        }
        var text = window.getSelection().toString().trim();
        if (text && icon.style.display == 'none') {
            icon.style.top = e.pageY +40 + 'px';
            if(e.pageX -70<10)
                icon.style.left='10px';
            else
                icon.style.left = e.pageX -70 + 'px';
            icon.style.display = 'block';
        } else if (!text) {
            icon.style.display = 'none';
        }
    });



    /**触发事件*/
    function tiggerEvent(el, type) {
        if ('createEvent' in document) {// modern browsers, IE9+
            var e = document.createEvent('HTMLEvents');
            e.initEvent(type, false, true);// event.initEvent(type, bubbles, cancelable);
            el.dispatchEvent(e);
        } else {// IE 8
            e = document.createEventObject();
            e.eventType = type;
            el.fireEvent('on' + e.eventType, e);
        }
    }

    /**在新标签页中打开*/
    function open(url) {
        var win;
            win = window.open(url);
        if (window.focus) {
            win.focus();
        }
        return win;
    }

})();
