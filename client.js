function consultar() {
   $.ajax({
      url: 'http://localhost:8080/formas-pagamento',
      type: 'GET',

      success: function(response) {
         preencherTabela(response)
      }
   })
}

function cadastrar() {
   var formaPagamentoJson = JSON.stringify({
      "descricao": $('#campo-descricao').val()
   });

   if ($('#btn-cadastrar').text() == 'Cadastrar') {
      $.ajax({
         url: 'http://localhost:8080/formas-pagamento',
         type: 'POST',
         data: formaPagamentoJson,
         contentType: 'application/json',
   
         success: function(response) {
            alert('Forma de pagamento foi cadastrada com sucesso.');
            consultar();
            $('#campo-descricao').val('');
         },
   
         error: function(error) {
            if (error.status == 400) {
               alert(error.responseJSON.userMessage);
            } else {
               alert('Erro ao cadastrar forma de pagamento.')
            }
         }
      });
   } else {
      var FormaPagamentoId = $('#campo-id').val();
      $.ajax({
         url: `http://localhost:8080/formas-pagamento/${FormaPagamentoId}`,
         type: 'PUT',
         data: formaPagamentoJson,
         contentType: 'application/json',
      
         success: function(response) {
            alert('Forma de pagamento atualizada com sucesso.');
            consultar();
            $('#campo-descricao').val('');
            $('#btn-cadastrar').text('Cadastrar');
         },
      
         error: function(error) {
            if (error.status >= 400 && error.status <= 499) {
               alert(error.responseJSON.userMessage);
            } else {
               alert('Erro ao atualizar forma de pagamento.');
            }
         }
      });
   }
}

function editar(formaPagamento) {
   $('#campo-descricao').val(formaPagamento.descricao);
   $('#campo-id').val(formaPagamento.id);
   $('#btn-cadastrar').text('Atualizar');
}

function excluir(formaPagamento) {
   $.ajax({
      url: `http://localhost:8080/formas-pagamento/${formaPagamento.id}`,
      type: 'DELETE',
      contentType: 'application/json',

      success: function() {
         alert('Forma de pagamento excluída com sucesso.');
         consultar();
      },

      error: function(error) {
         if (error.status >= 400 && error.status <= 499) {
            alert(error.responseJSON.userMessage);
         } else {
            alert('Erro ao excluir forma de pagamento.');
         }
      }
   });
}

function preencherTabela(formasPagamento) {
   $('#tabela tbody tr').remove();

   $.each(formasPagamento, function(i, formaPagamento) {
      var linha = $("<tr>");

      var botaoExcluir = $('<a href="#">')
         .text('Excluir')
         .click(function(event) {
            event.preventDefault();
            excluir(formaPagamento);
         });

      var botaoEditar = $('<a href="#">')
         .text('Editar')
         .click(function(event) {
            event.preventDefault();
            editar(formaPagamento);
         });

      linha.append(
         $('<td>').text(formaPagamento.id),
         $('<td>').text(formaPagamento.descricao),
         $('<td>').append(botaoEditar),
         $('<td>').append(botaoExcluir)
      );

      linha.appendTo('#tabela');
   });
}

$('#btn-cadastrar').click(cadastrar);
$('#btn-consultar').click(consultar);