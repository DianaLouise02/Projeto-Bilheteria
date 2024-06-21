document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('eventoForm');
  
    form.addEventListener('submit', function(event) {
      event.preventDefault(); 
  
      
      const nome = document.getElementById('nome').value;
      const sobrenome = document.getElementById('sobrenome').value;
      const email = document.getElementById('email').value;
      const documento = document.getElementById('tipo_documento').value;
      const nDocumento = document.getElementById('numero_documento').value;
      const genero = document.getElementById('sexo').value;
      const senha = document.getElementById('senha').value;
      const telefone = document.getElementById('numero_telefone').value;
      const nascimento = document.getElementById('data_nascimento').value;
  
      
      const user = {
        nome,
        sobrenome,
        documento,
        email,
        nDocumento,
        genero,
        senha,
        telefone,
        nascimento
      };

   
      fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      })
      .then(response => response.text())
      .then(data => {
        console.log(data); 
        alert('Cadastro enviado com sucesso!');
      })
      .catch(error => {
        console.error('Erro ao enviar dados:', error);
        alert('Erro ao enviar dados. Verifique o console para mais informações.');
      });
    });
  });
  