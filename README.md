 # IRB Prime Care Finance

Sistema web financeiro interno desenvolvido para clínicas médicas, com foco na padronização de valores de exames e serviços, garantindo mais eficiência, organização e redução de erros na recepção.

---

## Sobre o Projeto

O IRB Prime Care Finance foi criado para resolver um problema crítico na clínica:

### Problema
Divergência de preços de exames e serviços.

Isso gerava:
- Confusão no atendimento  
- Erros humanos frequentes  
- Dependência de planilhas Excel  
- Perda de tempo na recepção  

---

## Objetivo

- Centralizar valores de exames e serviços  
- Eliminar inconsistências de preços  
- Substituir planilhas Excel  
- Aumentar a produtividade da recepção  
- Melhorar a tomada de decisão  

---

## Público-Alvo

- Recepcionistas (uso principal)  
- Equipe de marketing  

---

## Tecnologias Utilizadas

### Backend
- Python  
- API REST  
- Estrutura modular  

### Banco de Dados
- MySQL  

### Integração e Testes
- Postman (testes de rotas e validação da API)  

---

## Estrutura do Projeto


IRB-Prime-Care-Finance/
│
├── backend/
│ ├── routes/
│ ├── controllers/
│ ├── models/
│ ├── database/
│ └── app.py
│
├── data/
│ ├── exames/
│ ├── campanhas/
│ └── usuarios/
│
└── README.md


---

## Funcionalidades

- Listagem de exames  
- Consulta rápida de valores  
- Padronização de preços  
- Substituição de planilhas Excel  

---

## Campanhas

### Funcionalidades
- Listagem de campanhas ativas  

### Informações exibidas
- Nome da campanha  
- Desconto  
- Clientes participantes  
- Dados dos clientes  

### Permissões

Marketing:
- Inserir campanhas no sistema  

Recepção:
- Visualizar campanhas  
- Consultar dados rapidamente  

---

## Planos da Clínica

### Planos disponíveis
- IRB Particular  
- Prime Plus  
- Prime Essential  
- Prime Elite  

### Regras
- Cada exame possui valores diferentes por plano  
- Exibição clara e organizada dos preços  

---

## Perfil do Usuário

- Nome  
- Idade  
- Plano atual  

O sistema considera a jornada do paciente para melhorar o atendimento:

- Identificação do perfil do cliente  
- Apoio à recepção na oferta de planos  
- Melhoria na abordagem comercial  

---

## Integrações Futuras

- Sistema Klingo  
- Integração via API  

---

## UX (Experiência do Usuário)

- Interface simples e intuitiva  
- Navegação rápida  
- Poucos cliques  
- Fácil aprendizado  

---

## Boas Práticas

- Código organizado  
- Arquitetura modular  
- Componentes reutilizáveis  
- Preparado para escalar  

---

## Resultado Esperado

Um sistema moderno e funcional que:

- Substitui planilhas Excel  
- Reduz erros humanos  
- Melhora a eficiência da clínica  
- Facilita o atendimento ao paciente  