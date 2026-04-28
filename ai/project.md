Este projeto é um site estático em Jekyll.

Stack:
- HTML via layouts e includes do Jekyll
- SCSS para estilização
- Ruby para configuração do Jekyll em /tools/ruby

Regras:
- Nunca criar frameworks JS
- Seguir o padrão de includes do Jekyll
- Reutilizar layouts

Estrutura das páginas (REGRA IMPORTANTE)

As páginas em /_layouts, /products, /blog, /contact, /legal NÃO seguem um template visual único.

Cada produto possui:
- Estrutura própria
- Componentes próprios
- Organização própria de seções
- Identidade visual própria

É intencional que:
- páginas dentro de /products tenham estruturas diferentes
- hero, stats, CTA e seções variem entre produtos

O agente NUNCA deve tentar padronizar a estrutura entre páginas de produtos.

A única padronização obrigatória é:
- HTML semântico
- uso correto do sistema de cores
- ausência de estilos inline
- uso do Bootstrap para layout
