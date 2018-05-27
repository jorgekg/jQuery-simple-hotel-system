$(document).ready(function(){
    $('#frm_pessoa').submit(function(){
        cadPessoa($('#nome').val(), $('#documento').val(), $('#fone').val());
        limparFecharModal();
        return false;
    });
    $('#frm_checkin').submit(function(){
        cadCheckin(
            $('#entrada').val(), $('#saida').val(), $('#pessoa').val(), $('#carro').val()
        );
        limpar();
        return false;
    });
    loadTable();
    $('#entrada').mask("99/99/9999 99:99");
    $('#saida').mask("99/99/9999 99:99");
});

function loadTable(){
    var checkin = getLocalstorage('checkin');
    if(checkin != null && checkin != null){
        checkin = JSON.parse(checkin);
        for(var i = 0; i < checkin.length; i++) {
            var ent = (new Date(checkin[i].entrada));
            var sai = (new Date(checkin[i].saida));
            if((sai.getHours() + sai.getMinutes()) >= 46){
                sai.setDate(sai.getDate() + 1);
            }
            var total = 0;
            while ((ent - sai) > 0){
                if (isFinalDeSemana(ent)) {
                    total += 150;
                } else {
                    total += 120;
                }
                ent.setDate(ent.getDate() + 1);
            }
            $('.table tbody').html("<tr><td>teste</td><td>teste</td><td>"+total+"</td></tr>");
        }
    }else{
        $('.table tbody').html("<tr><td colspan='3' align='center'>Nenhum registro</td></tr>");
    }
}

function isFinalDeSemana(date) {
    if(date.getDay() == 0 || date.getDay() == 6){
        return true;
    }
    return false;
}

function limpar(){
    $('#entrada').val("");
    $('#saida').val("");
    $('#pessoa').val("");
    $('#carro').val("");
}

function limparFecharModal(){
    $('#nome').val("");
    $('#documento').val("");
    $('#fone').val("");
    $('#cadPessoa').modal("hide");
}

function cadCheckin(entrada, saida, pessoa, carro){
    if(isDocumentoCadastrado(pessoa)){
        cadastrar('checkin',{
           entrada: new Date(Date.parse(formatDate(entrada))),
           saida : new Date(Date.parse(formatDate(entrada))),
           pessoa : pessoa,
           carro : carro
        });
    }else{
        $('#cadPessoa').modal();
        $('#documento').val(pessoa)
    }
}

function cadPessoa(nome, documento, fone) {
    if(!isDocumentoCadastrado(documento)){
        cadastrar('pessoa', {
            nome: nome,
            documento: documento,
            fone : fone
        });
    }
}

function cadastrar(bind, item){
    var obj = getLocalstorage(bind);
    if(obj != null && obj != "null"){
        obj = JSON.parse(obj);
        var itens = [];
        for(var i = 0 ; i < obj.length; i++){
            itens.push(obj[i]);
        }
        itens.push(item);
        setLocalstorage(bind, JSON.stringify(itens));
    }else{
        setLocalstorage(bind, JSON.stringify([item]));
    }
}

function isDocumentoCadastrado(documento) {
    var pessoas = getLocalstorage('pessoa');
    if(pessoas != null && pessoas != "null"){
        pessoas = JSON.parse(pessoas);
        for(var i = 0; i < pessoas.length; i++){
            if(pessoas[i].documento == documento){
                return true;
            }
        }
    }
    return false;
}

function validateDate(pThis){
    var date;
    try {
        var date_time = formatDate($(pThis).val())
        date = new Date(Date.parse(date_time));
    }catch (e) {
        $(pThis).val("");
    }
}

function formatDate(pValor){
    var regx = pValor.split("/");
    var dia = regx[0];
    var mes = regx[1];
    var ano_time = regx[2].split(' ');
    var ano = ano_time[0];
    var time = ano_time[1];
    return ano+"-"+mes+"-"+dia+"T"+time;
}

function getLocalstorage(bind){
    return localStorage.getItem(bind);
}

function setLocalstorage(bind, obj){
    localStorage.setItem(bind, obj);
}