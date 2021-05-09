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
                    buttonNode.style.backgroundColor = '#39e600';
                    inputNode.value = shortUrl;
                });
            } else if(buttonsState.shrink === 'copy')  {
                buttonNode.innerHTML = 'Copied';
                buttonNode.style.backgroundColor = '#1a6600';
                buttonsState.shrink = 'copied';
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
                    buttonNode.style.backgroundColor = '#39e600';
                    inputNode.value = longUrl;
                })
            } else if(buttonsState.expand === 'copy')  {
                buttonNode.style.backgroundColor = '#1a6600';
                buttonNode.innerHTML = 'Copied';
                buttonsState.expand === 'copied';
                inputNode.select();
                document.execCommand("copy");
            }
            event.preventDefault();
        },
        renderRecords: function() {
            
        }
    }
})();