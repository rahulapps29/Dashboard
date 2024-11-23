document.addEventListener("DOMContentLoaded", () => {
    const nameSelect = document.getElementById("nameSelect");
    const totalAmount = document.getElementById("totalAmount");
    const transactionList = document.getElementById("transactionList");

    fetch("http://localhost:3000/api/tasks")
        .then((response) => response.json())
        .then((data) => {
            const uniqueNames = [...new Set(data.map((item) => item.name))];
            uniqueNames.forEach((name) => {
                const option = document.createElement("option");
                option.value = name;
                option.textContent = name;
                nameSelect.appendChild(option);
            });
        });

    nameSelect.addEventListener("change", () => {
        const selectedName = nameSelect.value;

        if (selectedName) {
            fetch(`http://localhost:3000/api/tasks?name=${selectedName}`)
                .then((response) => response.json())
                .then((data) => {
                    const total = data.reduce((sum, item) => sum + item.Amt, 0);
                    totalAmount.textContent = total;

                    transactionList.innerHTML = "";
                    data.forEach((item) => {
                        const listItem = document.createElement("li");
                        listItem.textContent = `${item.TransactionDescription}: ${item.Amt}`;
                        transactionList.appendChild(listItem);
                    });
                });
        }
    });
});
