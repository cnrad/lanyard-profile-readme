<!-- markdownlint-disable -->
# lanyard-profile-readme

🏷️ 
Utilize o Lanyard para exibir sua presença no Discord em seu perfil do GitHub

_Agradecimentos especiais ao [@Phineas](https://github.com/Phineas/) por criar o Lanyard e tornar este projeto possível_

## Usabilidade

Primeiro, junte-se ao servidor [Lanyard](https://discord.com/invite/WScAm7vNGF) (se ainda não o fez) para que isso funcione.

Depois, sera necessario saber sua ID para ser usada na API. Caso não saiba como pegar seu ID, siga os passos do gif abaixo:

[![Modo Desenvolvedor](./modoDesenvolvedor.gif)](./modoDesenvolvedor.gif)

1.  Configurações de Usuário
2. Avançado
3. Ativar modo desenvolvedor
4. Minha conta
5. Clique nos tres pontos e copie a ID.

Para colocar o layout do discord, inclua o seguinte código em um arquivo `README.md`, substituindo `:id` pelo seu ID de usuário do Discord:

```md
[![Discord Presence](https://lanyard.cnrad.dev/api/:id)](https://discord.com/users/:id)
```

Ele deve exibir algo semelhante ao seguinte (estou usando meu ID de usuário do Discord como exemplo):

[![Discord Presence](https://lanyard.cnrad.dev/api/705665813994012695)](https://discord.com/users/705665813994012695)

Quando outros clicarem nele, eles serão direcionados para o seu perfil real do Discord.

## Opções de customização

Existem algumas opções para personalizar essa exibição usando parâmetros na url:

### ___Theme___

Anexe o parâmetro `theme=:theme` ao final da URL, substituindo `:theme` por `light` ou `dark`. Isso mudará o plano de fundo e as cores da fonte, mas o plano de fundo pode ser substituído pelo parâmetro ___Background Color___.

### ___Background Color___

Anexe o parâmetro `bg=:color` ao final da URL, substituindo `:color` por uma cor hexadecimal de sua escolha (omita o #)

### ___Border Radius___

Anexe o parâmetro `borderRadius=:radius` ao final da URL, substituindo `:radius` por um raio de sua escolha. (padrão `10px`)

### ___Toggle Animated Avatar___

Se você tiver um avatar animado, anexe o parâmetro `animated=:bool` ao final da URL, substituindo `:bool` por `true` ou `false`. Isso é definido como `true` por padrão.

### ___Custom Idle Message___

Se você não quiser o padrão "`I'm not currently doing anything!`" como sua mensagem ociosa, você pode alterá-lo anexando `idleMessage=:yourmessage` ao final da URL.

### ___Hide Discriminator___

Se você não quiser que as pessoas vejam seu discriminador (tag de perfil) (provavelmente por motivos de privacidade), acrescente o parâmetro `hideDiscrim=true` ao final da URL. Seu discriminador é mostrado por padrão.

### ___Hide Status___

Se você não quiser que as pessoas vejam seu status, anexe o parâmetro `hideStatus=true` ao final do URL. Seu status é mostrado por padrão, se você tiver um.

### ___Hide Elapsed Time___

Se você não quiser que as pessoas vejam o tempo decorrido em uma atividade, anexe o parâmetro`hideTimestamp=true` ao final do URL. O tempo decorrido é mostrado por padrão

### ___Hide Badges___

Se você não quiser que as pessoas vejam os emblemas que você tem no Discord, anexe o parâmetro `hideBadges=true` ao final da URL. Os emblemas são mostrados por padrão.

## ___Example URL and result___

```md
[![Discord Presence](https://lanyard-profile-readme.vercel.app/api/94490510688792576?theme=light&bg=809ecf&animated=false&hideDiscrim=true&borderRadius=30px&idleMessage=Probably%20doing%20something%20else...)](https://discord.com/users/94490510688792576)
```

[![Discord Presence](https://lanyard-profile-readme.vercel.app/api/94490510688792576?theme=light&bg=809ecf&animated=false&hideDiscrim=true&borderRadius=30px&idleMessage=Probably%20doing%20something%20else...)](https://discord.com/users/94490510688792576)

\
Observação: os emblemas Nitro e Boosting atuais **não funcionam** devido às limitações da API do Discord, a menos que você tenha atualmente um avatar animado; nesse caso, ele exibirá o emblema Nitro.

_Se você estiver usando isso em seu perfil, sinta-se à vontade para mostrar suporte e dar a este repositório uma ⭐ estrela! Significa muito, obrigado :)_

traduzido por: [Pedro Neves](https://github.com/pdr-tuche/)