// relatorio.js
import htmlTemplate from './relatorio.html?raw';
import cssContent from './styles_relatorio.css?raw';

function gerarRelatorio(formData) {
    let relatorio = htmlTemplate.replace('{{styles}}', cssContent);
    relatorio = relatorio.replace('{{nome}}', formData.get('nome'));
    relatorio = relatorio.replace('{{telefone}}', formData.get('telefone'));
    relatorio = relatorio.replace('{{equipamento}}', formData.get('equipamento'));
    relatorio = relatorio.replace('{{serie}}', formData.get('serie'));
    relatorio = relatorio.replace('{{garantia}}', formData.get('garantia'));
    relatorio = relatorio.replace('{{observacao}}', formData.get('observacao'));
    relatorio = relatorio.replace('{{relato}}', formData.get('relato'));
    
    return relatorio;
}