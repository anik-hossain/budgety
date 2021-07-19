(function () {
    var output = document.getElementById('time');
    function time() {
        var date = new Date();
        var hours = date.getHours();
        var minuites = date.getMinutes();
        var seconds = date.getSeconds();
        var timeFormat = 'AM';
        if (hours > 11) {
            timeFormat = 'PM';
        } else {
            timeFormat = 'AM';
        }
        if (hours > 12) {
            hours = hours - 12;
        } else {
            if (!hours) {
                hours = 12;
            }
            hours = hours;
        }
        if (hours > 9) {
            hours = hours;
        } else {
            hours = '0' + hours;
        }
        if (minuites > 9) {
            minuites = minuites;
        } else {
            minuites = '0' + minuites;
        }
        if (seconds > 9) {
            seconds = seconds;
        } else {
            seconds = '0' + seconds;
        }
        output.innerHTML =
            hours + ':' + minuites + ':' + seconds + ' ' + timeFormat;
    }
    time();
    setInterval(time, 1000);
})();

// Global Function
function $(selector) {
    return document.querySelector(selector);
}

// Budget Controller
let budgetController = (function () {})();

// User Interface Controller
let UIController = (function () {
    let DomString = {
        input: {
            type: '#type',
            desc: '#description',
            value: '#value',
        },
        addItem: '#add-btn',
    };

    return {
        getInput: () => {
            return {
                type: $(DomString.input.type).value,
                desc: $(DomString.input.desc).value,
                value: $(DomString.input.value).value,
            };
        },
        getDomString: () => {
            return DomString;
        },
    };
})();

// Application Controller
let controller = (function (budgerCtrl, UICtrl) {
    let Dom = UICtrl.getDomString();
    let setupEvntListenrs = () => {
        // Events
        $(Dom.addItem).addEventListener('click', (e) => {
            e.preventDefault();
            if (e.screenX > 0) {
                addNewItm();
            }
        });

        addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.keyCode === 13 || e.which === 13) {
                addNewItm();
            }
            false;
        });
    };

    // Add  new item
    let addNewItm = () => {
        // 1. Get the input field data
        let input = UICtrl.getInput();
        console.log(input);
        // 2. @TODO: Add the item to the budget controller
        // 3. @TODO: Add the item to UI
        // 4. @TODO: Calculate the budget
        // 5. @TODO: Display the budget on the UI
    };

    return {
        init: () => {
            console.log('Apllication has started');
            setupEvntListenrs();
        },
    };
})(budgetController, UIController);

controller.init();
