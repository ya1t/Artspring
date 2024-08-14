const time_h1 = document.body.querySelector("#_code");
            var num = 1;
            setInterval(() => {
                time_h1.textContent = num;
                num += 1;
            }, 1000);