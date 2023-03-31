"use strict";

((document) => {
    //const errorDiv = document.getElementById('error-crafting');

    function update() {
        const workerType = document.getElementById('crafting-worker-type');
        const workerHours = document.getElementById('crafting-worker-hours');

        // Check if hours are possible
        const totalHours = workerHours.value;

        if (totalHours < 1 || totalHours > 24) {
            alert('Invalid hours, must be between 0 - 24 hours.');
            return;
        }

        const workerList = document.getElementById("crafting-worker-list");

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
        const rate = document.getElementById('crafting-rate').value;

        if (rate < 0.01) {
            alert('Invalid rate, must be at least 0.01 gp');
            return;
        }

        const costElem = document.getElementById('crafting-item-types');
        const cost = costElem.value;
        const canAdept = costElem.options[costElem.selectedIndex].hasAttribute('magic-item-adept');

        const totalHoursRequired = cost / rate;
        const craftingTime = document.getElementById('crafting-time')
        const craftingCost = document.getElementById('crafting-cost')
        const craftingDays = document.getElementById('crafting-workdays')
        const craftingPerDays = document.getElementById('crafting-items')

        const workerList = document.getElementById("crafting-worker-list");
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

        const craftingTarget = Math.max(1, document.getElementById('crafting-target').value);

        craftingTime.innerHTML      = totalHoursRequired;
        craftingDays.innerHTML      = (totalWorkHours && totalWorkHours > 0 ? totalHoursRequired / totalWorkHours * craftingTarget : 'Unknown');
        craftingCost.innerHTML      = totalCost;
        craftingPerDays.innerHTML   = (totalWorkHours && totalWorkHours > 0 ? totalWorkHours / totalHoursRequired : 'Unknown');
    }

    const updatableElems = document.getElementsByClassName('crafting-updatable');
    for (var i = 0; i < updatableElems.length; ++i) {
        updatableElems[i].addEventListener('change', updateTotals);;
    }

    document.getElementById('crafting-add-worker-btn').addEventListener('click', update);

    updateTotals();
})(document);