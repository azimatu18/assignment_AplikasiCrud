const result = document.getElementById("result");
const form = document.getElementById("formInput")
const uForm = document.getElementById("updateForm")
const url = "http://localhost:3000/data";
const xhr = new XMLHttpRequest();
let updateID = 0

function fetchData() {
    xhr.onerror = function () {
        alert("error")
    }
    xhr.onloadstart = function () {
        result.innerHTML = "Start"
    }
    xhr.onloadend = function () {
        form.hidden = false
        uForm.hidden = true
        result.innerHTML = ""
        const data = JSON.parse(this.response)
        for (let i = 0; i < data.length; i++) {
            const node = document.createElement("div")
            node.innerHTML = `
                <div class="card mb-3 text-bg-secondary" style="width: 18rem;">
                    <div class="card-body">
                        <h1 class="card-tittle">${data[i].judul}</h1>
                        <p class="card-text">${data[i].desSingkat}</p>
                        <button class="btn btn-light" onclick="getData(${data[i].id})"><img src="eye.svg" alt="detail"></button>
                        <button class="btn btn-light" onclick="deleteData(${data[i].id})"><img src="trash.svg" alt="delete"></button>
                    </div>
                </div>
            `
            result.appendChild(node)
        }
    }

    xhr.onprogress = function () {
        result.innerHTML = "Loading..."
    }
    xhr.open("GET", url)
    xhr.send()
}

function postData(event) {
    event.preventDefault()
    const data = JSON.stringify({
        judul: document.getElementById("judul").value,
        desSingkat: document.getElementById("desSingkat").value,
        isi: document.getElementById("isi").value,
        gambar: document.getElementById("gambar").value,
    })

    xhr.open("POST", url)
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
    xhr.send(data)
}

function getData(id) {
    xhr.onloadend = function () {
        form.hidden = true
        result.innerHTML = ""
        const data = JSON.parse(this.response)
        const node = document.createElement("div")
        node.innerHTML = `
            <div class="card mb-3 text-bg-secondary">
                    <div class="card-body">
                        <h1 class="card-tittle">${data.judul}</h1>
                        <p class="card-text">${data.isi}</p>
                        <img src="${data.gambar}" class="card-img-top" alt="gambar" style="max-width: 50%;"><br>
                        <button class="btn btn-light mt-3" onclick="fetchData()">Kembali</button>
                        <button class="btn btn-light mt-3" onclick="setUpdate(${data.id})"><img src="pencil-square.svg" alt="edit"</button>
                    </div>
                </div>
        `
        result.appendChild(node)
    }

    xhr.open("GET", `${url}/${id}`)
    xhr.send()
}

function setUpdate(id) {
    xhr.onloadend = function () {
        uForm.hidden = false
        const data = JSON.parse(this.response)
        document.getElementById("uJudul").value = data.judul
        document.getElementById("uDesSingkat").value = data.desSingkat
        document.getElementById("uIsi").value = data.isi
        document.getElementById("uGambar").value = data.gambar

        uForm.addEventListener("submit", function (e) {
            e.preventDefault()
            const data = JSON.stringify({
                judul: document.getElementById("uJudul").value,
                desSingkat: document.getElementById("uDesSingkat").value,
                isi: document.getElementById("uIsi").value,
                gambar: document.getElementById("uGambar").value,
            })

            xhr.open("PUT", `${url}/${id}`)
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
            xhr.send(data)

        })
    }

    xhr.open("GET", `${url}/${id}`)
    xhr.send()
}



function deleteData(id) {
    xhr.open("DELETE", `${url}/${id}`)
    xhr.send()
}
