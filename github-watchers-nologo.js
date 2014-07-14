/*!
 * git-watchers.js - a repository watchers button for GitHub
 * http://addyosmani.com/
 * 
 * Copyright (c) 2011 Addy Osmani
 * Based on gitfollow by Guillermo Rauch
 * Dual licensed under the MIT and GPL licenses.
 *
 */

(function (window, document) {

    window.gitwatch = {

        text: '% watchers',

        styles: [
            '.gitwatch { background: #fafafa; background-color: #fbfbfb; background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#fbfbfb), to(#cccccc)); background-image: -webkit-linear-gradient(#fbfbfb, #cccccc); background-image: -moz-linear-gradient(#fbfbfb, #cccccc); background-image: -ms-linear-gradient(#fbfbfb, #cccccc); background-image: -o-linear-gradient(#fbfbfb, #cccccc); background-image: linear-gradient(#fbfbfb, #cccccc); font: 11px "Lucida Grande", Verdana, sans-serif; outline: 0; -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.6); -moz-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.6); box-shadow: 0 1px 3px rgba(0, 0, 0, 0.6); font-weight: bold; line-height: 1; cursor: pointer; position: relative; text-decoration: none; width: auto; border-bottom-color: rgba(0, 0, 0, 0.3); -webkit-border-radius: 15px; -moz-border-radius: 15px; border-radius:15px; padding: 4px 14px 6px; color: #4183C4; text-shadow: 0 1px 0 #fff; }',
            '.gitwatch:active { top: 1px; }',
            '.gitwatch:hover { background: #eee; text-decoration: none; }',
            '.gitwatch img { vertical-align: middle; padding-right: 5px; border: 0; }',
            '.gitwatch.vertical { padding: 10px 15px 8px; font-size:30px; letter-spacing:-2px; bottom:5px; }',
            '.gitwatch.small { padding: 2px 14px 4px; }'
        ],

        className: 'gitwatch',

        injectScript: function ( src ) {
            var script = document.createElement('script');
            script.src = src;
            document.body.appendChild(script);
        },

        applyCss: function (css) {
            var style = document.createElement('style');
            style.type = 'text/css';

            try {
                style.appendChild(document.createTextNode(css));
            } catch (e) {
                if (style.styleSheet) {
                    style.styleSheet.cssText = css;
                }
            }

            document.body.appendChild(style);
        },


        getByClass: function () {
            if (document.getElementsByClassName) {
                return document.getElementsByClassName('gitwatch');
            } else {
                var links = document.getElementsByTagName('a'),
                    found = [];
                for (var i = 0, l = links.length; i < l; i++) {
                    if ((' ' + this + ' ').indexOf(' ' + links[i].className + ' ') > -1) {
                        found.push(links[i]);
                    }
                }
                return found;
            }
        },

        run: function () {
            this.elements = this.getByClass(this.className);
            if (this.elements && this.elements.length === 0) {
                //if (window.console) console.log('No elements found to use with gitwatch.');
                return false;
            }
            var match = this.elements[0].href.match(/com\/([^\s\/]+)\/([^\s\/]+)/);
            if (!match || !match[1]) {
                //if (window.console) console.log('Bad GitHub URL ' + this.elements[0].href);
                return false;
            }

            this.username = match[1];
            this.reponame = match[2];

            this.injectScript('https://api.github.com/repos/' + encodeURIComponent(this.username) + '/' + encodeURIComponent(this.reponame) + '?callback=' + encodeURIComponent('gitwatch.callback'));
        },

        callback: function ( object ) {
            if (object && object.data) {
                this.apply(object.data.watchers);
            }
        },

        apply: function ( count ) {
            this.applyCss(this.styles.join(''));
            var text = "";

            for (var i = 0, l = this.elements.length; i < l; i++) {
                var currentEl = this.elements[i],
	                currentClass = currentEl.className;

                if (currentClass.indexOf('small') > 0 || currentClass.indexOf('vertical') > 0) {
                    text = count;
                } else {
                    text = this.text.replace(/%/, count);
                }
                currentEl.innerHTML = text;
            }
        }

    };

    var run = function () {
        window.gitwatch.run();
    };

    if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', run , false);
    } else if (window.attachEvent) {
        window.attachEvent('onload', run);
    }

})( window, document );