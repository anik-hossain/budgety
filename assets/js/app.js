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
function createEl(el) {
    return document.createElement(el);
}

// Budget Controller
let budgetController = (function () {
    let Expense = function (id, desc, value) {
        this.id = id;
        this.desc = desc;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function () {
        return this.percentage;
    };

    let Income = function (id, desc, value) {
        this.id = id;
        this.desc = desc;
        this.value = value;
    };

    let calucalteTotal = (type) => {
        let sum = 0;
        data.allItems[type].forEach((el) => {
            sum += el.value;
        });
        data.totals[type] = sum;
    };

    let data = {
        allItems: {
            exp: [],
            inc: [],
        },
        budget: 0,
        percentage: -1,
        totals: {
            exp: 0,
            inc: 0,
        },
    };

    return {
        addItem: (type, desc, value) => {
            let newItem, ID;

            // Create new ID based on type
            data.allItems[type].length > 0
                ? (ID =
                      data.allItems[type][data.allItems[type].length - 1].id +
                      1)
                : (ID = 0);

            // Create new item based on type
            type === 'exp'
                ? (newItem = new Expense(ID, desc, value))
                : (newItem = new Income(ID, desc, value));

            // Push new item to data structure
            data.allItems[type].push(newItem);

            // Retrun the new item
            return newItem;
        },
        calculateBudget: () => {
            // 1. Calculate total income and expenses
            calucalteTotal('exp');
            calucalteTotal('inc');

            // 2.Calculate the budget: (income - expenses)
            data.budget = data.totals.inc - data.totals.exp;

            // 3. Calculate the parcentage of income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round(
                    (data.totals.exp / data.totals.inc) * 100
                );
            } else {
                data.percentage = -1;
            }
        },
        calucaltePercentages: () => {
            data.allItems.exp.forEach((el) => {
                el.calcPercentage(data.totals.inc);
            });
        },
        deleteItem: (type, id) => {
            let ids, index;

            ids = data.allItems[type].map((el) => {
                return el.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },
        getBudget: () => {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage,
            };
        },
        getPercentages: () => {
            let percentages = data.allItems.exp.map((el) => {
                return el.getPercentage();
            });
            return percentages;
        },
        testing: () => {
            console.log(data);
        },
    };
})();

// User Interface Controller
let UIController = (function () {
    let DomString = {
        addItem: '#add-btn',
        input: {
            type: '#type',
            desc: '#description',
            value: '#value',
        },
        listContainer: {
            exp: '#exp-list ul',
            inc: '#inc-list ul',
            container: '.list',
        },
        label: {
            remaining: '.remaining',
            totalInc: '.total-inc',
            totalExp: '.total-exp',
            t_percentage: '.t-percentage',
        },
        percentage: '.percentage',
    };

    return {
        addListItem: (obj, type) => {
            let div, del, li, span1, span2, span3, ul;

            del = createEl('button');
            div = createEl('div');
            li = createEl('li');
            span1 = createEl('span');
            span2 = createEl('span');
            span3 = createEl('span');

            del.className = 'fa fa-times';
            div.className = 'd-flex';
            li.id = `${type}-id-${obj.id}`;
            span1.className = 'item-desc';
            span2.className = 'item-value';
            span3.className = 'percentage';

            span1.innerHTML = obj.desc;
            span2.innerHTML = obj.value;

            if (type === 'exp') {
                div.append(span2, span3, del);
                li.append(span1, div);
                ul = $(DomString.listContainer.exp);
            } else {
                div.append(span2, del);
                li.append(span1, div);
                ul = $(DomString.listContainer.inc);
            }

            ul.appendChild(li);
        },
        clearFields: () => {
            let fields, focusEl;
            fields = document.querySelectorAll(
                DomString.input.desc + ',' + DomString.input.value
            );
            fields.forEach((el, index, node) => {
                el.value = '';
                focusEl = node[0];
            });

            focusEl.focus();
        },
        deleteListItem: (selctorId) => {
            let selctor = $('#' + selctorId);
            selctor.parentNode.removeChild(selctor);
        },
        displayBudget: (obj) => {
            $(DomString.label.remaining).textContent = obj.budget;
            $(DomString.label.totalExp).textContent = obj.totalExp;
            $(DomString.label.totalInc).textContent = obj.totalInc;
            if (obj.percentage > 0) {
                $(DomString.label.t_percentage).textContent =
                    obj.percentage + '%';
            } else {
                $(DomString.label.t_percentage).textContent = '---';
            }
        },
        displayPercentages: (percentages) => {
            let fields = document.querySelectorAll(DomString.percentage);

            fields.forEach((el, key) => {
                if (percentages[key] > 0) {
                    el.textContent = percentages[key] + '%';
                } else {
                    el.textContent = '---';
                }
            });
        },
        getDomString: () => {
            return DomString;
        },
        getInput: () => {
            return {
                type: $(DomString.input.type).value,
                desc: $(DomString.input.desc).value,
                value: parseFloat($(DomString.input.value).value),
            };
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

        // Delete Item
        $(Dom.listContainer.container).addEventListener('click', deleteItem);
    };

    // Add  new item
    let addNewItm = () => {
        let input, newItem;
        // 1. Get the input field data
        input = UICtrl.getInput();

        if (input.desc !== '' && !isNaN(input.value) && input.value > 0) {
            // 2. Add the item to the budget controller
            newItem = budgerCtrl.addItem(input.type, input.desc, input.value);

            // 3. Add the item to UI
            UIController.addListItem(newItem, input.type);

            // 4. Calculate and Update Budget
            updateBudget();

            // 5. Clear the fields
            UICtrl.clearFields();

            // 6. Calculate and update the percentages
            updatePercentage();
        }
    };

    // Delete Item
    let deleteItem = (e) => {
        let item, id, splitId, type;

        item = e.target.parentNode.parentNode.id;

        if (item) {
            splitId = item.split('-');
            type = splitId[0];
            id = parseInt(splitId[2]);

            // 1. Delete the item from data structure
            budgerCtrl.deleteItem(type, id);

            // 2. Delete the item from UI
            UICtrl.deleteListItem(item);

            // 3. Update the show new budget
            updateBudget();

            // 4. Calculate and update the percentages
            updatePercentage();
        }
    };

    let updateBudget = () => {
        // 1. Calculate the budget
        budgerCtrl.calculateBudget();

        // 2. Rrturn the budget
        let budget = budgerCtrl.getBudget();

        // 3. Display the budget on the UI
        UIController.displayBudget(budget);
    };

    let updatePercentage = () => {
        // 1. Calculte percentage
        budgerCtrl.calucaltePercentages();

        // 2. Read percentage from the budget controller
        let percentages = budgerCtrl.getPercentages();

        // 3. Update the UI
        UICtrl.displayPercentages(percentages);
    };

    return {
        init: () => {
            console.log('Apllication has started');
            UIController.displayBudget({
                budget: '00',
                totalInc: '00',
                totalExp: '00',
                percentage: 0,
            });
            setupEvntListenrs();
        },
    };
})(budgetController, UIController);

controller.init();
