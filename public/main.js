const socket = io()

    const form = document.getElementById('form')
    const input = document.getElementById('input')
    let productDom = document.getElementById('productDom')
    
    
   //esuchar el evento de cuando alguien aprete enviar
    form.addEventListener('submit', (event) => {
        //para no recargar la pagina
        event.preventDefault()
        if(input.value) {
            socket.emit('producto', input.value)
            input.value = ''
        }
    })

    //renderizar mensajes que vienen del servidor
    function render (data) {
        let html = data.map(function(elem, index) {
            return(`<div>
            <strong style="color:blue">${elem.email}</strong>:
            <em style="color:brown">${elem.fecha}</em>
            <em style="color:green", "font-style: italic">${elem.text}</em>
            </div>`)
        }).join(' ');
        document.getElementById('messages').innerHTML = html;
        }
        socket.on('messages', function(data) {
            render (data)
            console.log(data);
        })

      //definimos la funcion para enviar el mensaje al servidor
    function addMessage(e) {
        
        let mensaje = {
            email: document.getElementById('email').value,
            fecha: new Date(),
            text: document.getElementById('texto').value
        }
        socket.emit('new-message', mensaje)
        return false
    }
  
    