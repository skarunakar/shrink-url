const App = (function(){
    const buttonsState = {
        shrink: 'shrink',
        expand: 'expand',
    };
    return {
        handleShrinkSubmit: (event) => {
            const buttonNode =  document.getElementById('button-shrink');
            const inputNode = document.getElementById('longUrl');
            if(buttonsState.shrink === 'shrink') {
                const longUrl = inputNode.value;
                http.post('api/shrink', { longUrl })
                .then((response) => {
                    const {shortUrl} = response.data;
                    buttonsState.shrink = 'copy';
                    buttonNode.innerHTML = 'Copy';
                    buttonNode.style.backgroundColor = '#b30059';
                    inputNode.value = shortUrl;
                    App.renderRecords();
                })
                .catch((err) => {
                    console.error(err.message);
                    const errorNode =  document.getElementById('shrink-error');
                    errorNode.innerHTML = 'Invalid Long Url';
                });
            } else if(buttonsState.shrink === 'copy')  {
                buttonNode.innerHTML = 'Copied';
                buttonNode.style.backgroundColor = '#1a6600';
                buttonsState.shrink = 'copied';
                inputNode.select();
                document.execCommand("copy");
            } else {
                inputNode.select();
                document.execCommand("copy");
            }
            event.preventDefault();

        },
        handleShrinkInputChange: (event) => {
            const inputValue = event.target.value;
            const buttonNode =  document.getElementById('button-shrink');
            if(!inputValue) {
                buttonNode.style.backgroundColor = '#2281c2';
                buttonNode.innerHTML = 'Shrink';
                buttonsState.shrink ='shrink';
            }

        },
        handleExpandInputChange: (event) => {
            const inputValue = event.target.value;
            const buttonNode =  document.getElementById('button-expand');
            if(!inputValue) {
                buttonNode.style.backgroundColor = '#2281c2';
                buttonNode.innerHTML = 'Expand';
                buttonsState.expand ='expand';
            }
        },
        handleExpandSubmit: (event) => {
            const buttonNode =  document.getElementById('button-expand');
            const inputNode = document.getElementById('shortUrl');
            if(buttonsState.expand === 'expand') {
                const shortUrl = inputNode.value
                http.post('api/expand', { shortUrl })
                .then((response) => {
                    const {longUrl} = response.data;
                    buttonNode.innerHTML = 'Copy';
                    buttonsState.expand = 'copy';
                    buttonNode.style.backgroundColor = '#b30059';
                    inputNode.value = longUrl;
                }).catch((err) => {
                    console.error(err.message);
                    const errorNode =  document.getElementById('expand-error');
                    errorNode.innerHTML = 'Invalid Short Url';
                })
            } else if(buttonsState.expand === 'copy')  {
                buttonNode.style.backgroundColor = '#1a6600';
                buttonNode.innerHTML = 'Copied';
                buttonsState.expand === 'copied';
                inputNode.select();
                document.execCommand("copy");
            } else {
                inputNode.select();
                document.execCommand("copy");
            }
            event.preventDefault();
        },
        constructTableHead: function(table) {
            const tr = table.insertRow();
            let th = tr.insertCell();
            th.innerHTML = 'Long URL';
            tr.appendChild(th);
            th = tr.insertCell();
            th.innerHTML = 'Short URL';
            tr.appendChild(th);

        },
        constructTableBody: function(table, allRecords) {

            for(let i =0; i< allRecords.length; i++) {
                const tr = table.insertRow();
                let td = tr.insertCell();
                td.innerHTML = `<a href=${allRecords[i]?.longUrl} target="_blank">${allRecords[i]?.longUrl}</a>`;
                tr.appendChild(td);
                td = tr.insertCell();
                td.innerHTML = `<a href=${allRecords[i]?.shortUrl} target="_blank">${allRecords[i]?.shortUrl}</a>`;
                tr.appendChild(td);
            }

        },
        renderRecords: function() {
            const tableParent =  document.getElementById('display-section');
            http.get('api/getRecords')
            .then((response) => {
                const allRecords = response?.data;
                if(allRecords?.length) {
                    const table = document.createElement('table');
                    this.constructTableHead(table);
                    this.constructTableBody(table, allRecords);
                    tableParent.innerHTML = '';
                    tableParent.appendChild(table);
                }
            });
        }
    }
})();

window.onload = function() {
    App.renderRecords();
};