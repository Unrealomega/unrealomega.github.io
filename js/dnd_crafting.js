"use strict";

((document) => {
    function update() {
        const workerType = document.getElementById('worker-type');
        const workerHours = document.getElementById('worker-hours');

        // Check if hours are possible
        const totalHours = workerHours.value;

        if (totalHours < 1 || totalHours > 24) {
            console.log('Invalid hours');
            return;
        }

        const workerList = document.getElementById("worker-list");

        // Create an empty tr
        const row = workerList.insertRow(-1);

        const type              = row.insertCell(0);
        const hours             = row.insertCell(1);
        const magicItemAdept    = row.insertCell(2);

        type.innerHTML              = workerType.options[workerType.selectedIndex].text;
        magicItemAdept.innerHTML    = workerType.value == 4 ? 'Y' : 'N';
        hours.innerHTML             = totalHours;

        const removeLink = document.createElement("a");
        removeLink.setAttribute('class', 'remove-row');
        removeLink.text = ' [X]';

        type.appendChild(removeLink);

        removeLink.addEventListener("click", (e) => {
            row.remove();

            updateTotals();

            e.preventDefault();
        }, false);

        // Update our totals
        updateTotals();
    }

    function updateTotals() {
        const rate = document.getElementById('rate').value;

        const costElem = document.getElementById('cost');
        const cost = costElem.value;
        const canAdept = costElem.options[costElem.selectedIndex].hasAttribute('magic-item-adept');

        const totalHoursRequired = cost / rate;
        const craftingTime = document.getElementById('crafting-time')
        const craftingCost = document.getElementById('crafting-cost')
        const craftingDays = document.getElementById('crafting-workdays')

        const workerList = document.getElementById("worker-list");
        let totalWorkHours = 0;
        let totalCost = cost;

        for (let i = 0; i < workerList.rows.length; i++) {
            const row = workerList.rows[i];
            const workerAdept = canAdept && row.cells[2].innerHTML == 'Y';

            totalWorkHours += parseInt(row.cells[1].innerHTML) * (workerAdept ? 4 : 1);

            if (workerAdept) {
                totalCost /= 2;
            }
        }

        craftingTime.innerHTML = totalHoursRequired;
        craftingDays.innerHTML = (totalWorkHours && totalWorkHours > 0 ? totalHoursRequired / totalWorkHours : 'Unknown');
        craftingCost.innerHTML = totalCost;
    }

    document.getElementById('rate').addEventListener('change', updateTotals);
    document.getElementById('cost').addEventListener('change', updateTotals);

    document.getElementById('add-worker-btn').addEventListener('click', update);

    updateTotals();
})(document);