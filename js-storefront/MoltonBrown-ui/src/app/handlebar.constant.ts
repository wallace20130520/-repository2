
export const AMPLIENCETEMPLATE = {
    SPLITCARD:`<div class="amp-dc-splitBlock{{#if split}}{{else}} full-size{{/if}}">
    {{#each content}}
        <div class="amp-dc-split-part {{splitBlock @index ../split}}">
            <div class="amp-dc-split-part-wrap">
                {{templateChooser this}}
            </div>
        </div>
    {{/each}}
</div>
`,
    HOME:`<div class="amp-dc-MBHomePage">
    {{#each contentTypes}}
        <div class="amp-dc-block-wrap">{{templateChooser this}}</div>
    {{/each}}
</div>
`,
        CARD:`
        <div class="amp-dc-card amp-dc-card-{{math addTemplateClassname '+' 1}}">
{{#if link}}
    <a class="amp-dc-card-wrap" href="{{link.value}}">
{{else}}
    <div class="amp-dc-card-wrap">
{{/if}}

    <div class="amp-dc-card-img-wrap">
    {{> cardImage }}
    </div>


    <div class="amp-dc-card-text-wrap
        {{#unless cardName}}
        {{#unless description}}
            {{#unless link}}
                        amp-dc-hide
                 {{/unless}}
        {{/unless}}
    {{/unless}}">

        {{#if cardName}}
            <div class="amp-dc-card-name">{{cardName}}</div>
        {{/if}}
        {{#if description}}
            <p class="amp-dc-card-description">{{description}}</p>
        {{/if}}
        {{#if link}}
            <div class="amp-dc-card-link">
                {{#if link.label}}
                    {{link.label}}
                {{else}}

                {{/if}}
            </div>
        {{/if}}
    </div>

{{#if link}}
    </a>
{{else}}
    </div>
{{/if}}

</div>

        `,
    CSDEMO: `<picture class="amp-dc-image">
    {{#roundelProperties}}
        <source srcset="//{{cardImage.image.defaultHost}}/i/{{cardImage.image.endpoint}}/{{escapeUrl cardImage.image.name}}{{#if seoText}}/{{escapeUrl
                seoText}}{{/if}}.webp?w=1600&$roundel$&{{roundelConfig
                roundel}} 1x, //{{cardImage.image.defaultHost}}/i/{{cardImage.image.endpoint}}/{{escapeUrl cardImage.image.name}}{{#if
                seoText}}/{{escapeUrl seoText}}{{/if}}.webp?w=3200&$roundel$&{{roundelConfig roundel}} 2x"
                media="(min-width: 1280px)"
                type="image/webp">
        <source srcset="//{{cardImage.image.defaultHost}}/i/{{cardImage.image.endpoint}}/{{escapeUrl cardImage.image.name}}{{#if seoText}}/{{escapeUrl
                seoText}}{{/if}}?w=1600&$roundel$&{{roundelConfig
                roundel}} 1x, //{{cardImage.image.defaultHost}}/i/{{cardImage.image.endpoint}}/{{escapeUrl cardImage.image.name}}{{#if
                seoText}}/{{escapeUrl seoText}}{{/if}}?w=3200&$roundel$&{{roundelConfig roundel}} 2x"
                media="(min-width: 1280px)">

        <source srcset="//{{cardImage.image.defaultHost}}/i/{{cardImage.image.endpoint}}/{{escapeUrl cardImage.image.name}}{{#if seoText}}/{{escapeUrl
                seoText}}{{/if}}.webp?w=1280&$roundel$&{{roundelConfig
                roundel}} 1x, //{{cardImage.image.defaultHost}}/i/{{cardImage.image.endpoint}}/{{escapeUrl cardImage.image.name}}{{#if
                seoText}}/{{escapeUrl seoText}}{{/if}}.webp?w=2560&$roundel$&{{roundelConfig roundel}} 2x"
                media="(min-width: 1024px)"
                type="image/webp">
        <source srcset="//{{cardImage.image.defaultHost}}/i/{{cardImage.image.endpoint}}/{{escapeUrl cardImage.image.name}}{{#if seoText}}/{{escapeUrl
                seoText}}{{/if}}?w=1280&$roundel$&{{roundelConfig
                roundel}} 1x, //{{cardImage.image.defaultHost}}/i/{{cardImage.image.endpoint}}/{{escapeUrl cardImage.image.name}}{{#if
                seoText}}/{{escapeUrl seoText}}{{/if}}?w=2560&$roundel$&{{roundelConfig roundel}} 2x"
                media="(min-width: 1024px)">

        <source srcset="//{{cardImage.image.defaultHost}}/i/{{cardImage.image.endpoint}}/{{escapeUrl cardImage.image.name}}{{#if seoText}}/{{escapeUrl
                seoText}}{{/if}}.webp?w=1024&$roundel$&{{roundelConfig
                roundel}} 1x, //{{cardImage.image.defaultHost}}/i/{{cardImage.image.endpoint}}/{{escapeUrl cardImage.image.name}}{{#if
                seoText}}/{{escapeUrl seoText}}{{/if}}.webp?w=2048&$roundel$&{{roundelConfig roundel}} 2x"
                media="(min-width: 768px)"
                type="image/webp">
        <source srcset="//{{cardImage.image.defaultHost}}/i/{{cardImage.image.endpoint}}/{{escapeUrl cardImage.image.name}}{{#if seoText}}/{{escapeUrl
                seoText}}{{/if}}?w=1024&$roundel$&{{roundelConfig
                roundel}} 1x, //{{cardImage.image.defaultHost}}/i/{{cardImage.image.endpoint}}/{{escapeUrl cardImage.image.name}}{{#if
                seoText}}/{{escapeUrl seoText}}{{/if}}?w=2048&$roundel$&{{roundelConfig roundel}} 2x"
                media="(min-width: 768px)">

        <source srcset="//{{cardImage.image.defaultHost}}/i/{{cardImage.image.endpoint}}/{{escapeUrl cardImage.image.name}}{{#if seoText}}/{{escapeUrl
                seoText}}{{/if}}.webp?w=768&$roundel$&{{roundelConfig
                roundel}} 1x, //{{cardImage.image.defaultHost}}/i/{{cardImage.image.endpoint}}/{{escapeUrl cardImage.image.name}}{{#if
                seoText}}/{{escapeUrl seoText}}{{/if}}.webp?w=1536&$roundel$&{{roundelConfig roundel}} 2x"
                media="(max-width: 768px)"
                type="image/webp">
        <source srcset="//{{cardImage.image.defaultHost}}/i/{{cardImage.image.endpoint}}/{{escapeUrl cardImage.image.name}}{{#if seoText}}/{{escapeUrl
                seoText}}{{/if}}?w=768&$roundel$&{{roundelConfig
                roundel}} 1x, //{{cardImage.image.defaultHost}}/i/{{cardImage.image.endpoint}}/{{escapeUrl cardImage.image.name}}{{#if
                seoText}}/{{escapeUrl seoText}}{{/if}}?w=1536&$roundel$&{{roundelConfig roundel}} 2x"
                media="(max-width: 768px)">

        <img src="//{{cardImage.image.defaultHost}}/i/{{cardImage.image.endpoint}}/{{escapeUrl cardImage.image.name}}{{#if seoText}}/{{escapeUrl
                seoText}}{{/if}}?w=1600&$roundel$&{{roundelConfig roundel}}"
             srcset="//{{cardImage.image.defaultHost}}/i/{{cardImage.image.endpoint}}/{{escapeUrl cardImage.image.name}}{{#if seoText}}/{{escapeUrl
                     seoText}}{{/if}}.webp?w=1600&$roundel$&{{roundelConfig
                     roundel}} 1x, //{{cardImage.image.defaultHost}}/i/{{cardImage.image.endpoint}}/{{escapeUrl cardImage.image.name}}{{#if
                     seoText}}/{{escapeUrl seoText}}{{/if}}.webp?w=3200&$roundel$&{{roundelConfig roundel}} 2x,
             //{{cardImage.image.defaultHost}}/i/{{cardImage.image.endpoint}}/{{escapeUrl cardImage.image.name}}{{#if seoText}}/{{escapeUrl
                     seoText}}{{/if}}?w=1600&$roundel$&{{roundelConfig
                     roundel}} 1x, //{{cardImage.image.defaultHost}}/i/{{cardImage.image.endpoint}}/{{escapeUrl cardImage.image.name}}{{#if
                     seoText}}/{{escapeUrl seoText}}{{/if}}?w=3200&$roundel$&{{roundelConfig roundel}} 2x"
             class="amp-dc-image-pic" {{#if imageAltText}} alt="{{cardImage.imageAltText}}" {{/if}}/>
    {{else}}
        <source srcset="//{{cardImage.image.defaultHost}}/i/{{cardImage.image.endpoint}}/{{escapeUrl cardImage.image.name}}{{#if seoText}}/{{escapeUrl
                seoText}}{{/if}}.webp?w=1600 1x, //{{cardImage.image.defaultHost}}/i/{{cardImage.image.endpoint}}/{{escapeUrl
                cardImage.image.name}}{{#if seoText}}/{{escapeUrl seoText}}{{/if}}.webp?w=3200 2x"
                media="(min-width: 1280px)"
                type="image/webp">
        <source srcset="//{{cardImage.image.defaultHost}}/i/{{cardImage.image.endpoint}}/{{escapeUrl cardImage.image.name}}{{#if seoText}}/{{escapeUrl
                seoText}}{{/if}}?w=1600 1x, //{{cardImage.image.defaultHost}}/i/{{cardImage.image.endpoint}}/{{escapeUrl cardImage.image.name}}{{#if
                seoText}}/{{escapeUrl seoText}}{{/if}}?w=3200 2x"
                media="(min-width: 1280px)">

        <source srcset="//{{cardImage.image.defaultHost}}/i/{{cardImage.image.endpoint}}/{{escapeUrl cardImage.image.name}}{{#if seoText}}/{{escapeUrl
                seoText}}{{/if}}.webp?w=1280 1x, //{{cardImage.image.defaultHost}}/i/{{cardImage.image.endpoint}}/{{escapeUrl
                cardImage.image.name}}{{#if seoText}}/{{escapeUrl seoText}}{{/if}}.webp?w=2560 2x"
                media="(min-width: 1024px)"
                type="image/webp">
        <source srcset="//{{cardImage.image.defaultHost}}/i/{{cardImage.image.endpoint}}/{{escapeUrl cardImage.image.name}}{{#if seoText}}/{{escapeUrl
                seoText}}{{/if}}?w=1280 1x, //{{cardImage.image.defaultHost}}/i/{{cardImage.image.endpoint}}/{{escapeUrl cardImage.image.name}}{{#if
                seoText}}/{{escapeUrl seoText}}{{/if}}?w=2560 2x"
                media="(min-width: 1024px)">

        <source srcset="//{{cardImage.image.defaultHost}}/i/{{cardImage.image.endpoint}}/{{escapeUrl cardImage.image.name}}{{#if seoText}}/{{escapeUrl
                seoText}}{{/if}}.webp?w=1024 1x, //{{cardImage.image.defaultHost}}/i/{{cardImage.image.endpoint}}/{{escapeUrl
                cardImage.image.name}}{{#if seoText}}/{{escapeUrl seoText}}{{/if}}.webp?w=2048 2x"
                media="(min-width: 768px)"
                type="image/webp">
        <source srcset="//{{cardImage.image.defaultHost}}/i/{{cardImage.image.endpoint}}/{{escapeUrl cardImage.image.name}}{{#if seoText}}/{{escapeUrl
                seoText}}{{/if}}?w=1024 1x, //{{cardImage.image.defaultHost}}/i/{{cardImage.image.endpoint}}/{{escapeUrl cardImage.image.name}}{{#if
                seoText}}/{{escapeUrl seoText}}{{/if}}?w=2048 2x"
                media="(min-width: 768px)">

        <source srcset="//{{cardImage.image.defaultHost}}/i/{{cardImage.image.endpoint}}/{{escapeUrl cardImage.image.name}}{{#if seoText}}/{{escapeUrl
                seoText}}{{/if}}.webp?w=768 1x, //{{cardImage.image.defaultHost}}/i/{{cardImage.image.endpoint}}/{{escapeUrl
                cardImage.image.name}}{{#if seoText}}/{{escapeUrl seoText}}{{/if}}.webp?w=1536 2x"
                media="(max-width: 768px)"
                type="image/webp">
        <source srcset="//{{cardImage.image.defaultHost}}/i/{{cardImage.image.endpoint}}/{{escapeUrl cardImage.image.name}}{{#if seoText}}/{{escapeUrl
                seoText}}{{/if}}?w=768 1x, //{{cardImage.image.defaultHost}}/i/{{cardImage.image.endpoint}}/{{escapeUrl cardImage.image.name}}{{#if
                seoText}}/{{escapeUrl seoText}}{{/if}}?w=1536 2x"
                media="(max-width: 768px)">

        <img  src="//{{cardImage.image.defaultHost}}/i/{{cardImage.image.endpoint}}/{{escapeUrl cardImage.image.name}}{{#if seoText}}/{{escapeUrl
                seoText}}{{/if}}?w=1600"
             srcset="//{{cardImage.image.defaultHost}}/i/{{cardImage.image.endpoint}}/{{escapeUrl cardImage.cardImage.image.name}}{{#if seoText}}/{{escapeUrl
                     seoText}}{{/if}}.webp?w=1600 1x, //{{cardImage.image.defaultHost}}/i/{{cardImage.image.endpoint}}/{{escapeUrl
                     cardImage.cardImage.image.name}}{{#if seoText}}/{{escapeUrl seoText}}{{/if}}.webp?w=3200 2x,
             //{{cardImage.image.defaultHost}}/i/{{cardImage.image.endpoint}}/{{escapeUrl cardImage.cardImage.image.name}}{{#if seoText}}/{{escapeUrl
                     seoText}}{{/if}}?w=1600 1x, //{{cardImage.image.defaultHost}}/i/{{cardImage.image.endpoint}}/{{escapeUrl
                     cardImage.cardImage.image.name}}{{#if seoText}}/{{escapeUrl seoText}}{{/if}}?w=3200 2x"
             class="amp-dc-image-pic" {{#if imageAltText}} alt="{{cardImage.imageAltText}}" {{/if}}/>
    {{/roundelProperties}}
</picture>`,
    _mbText:`<div class="amp-dc-text">
    {{text}}
</div>`,
banner:`
<div class="amp-dc-banner js_dc_banner">
{{bannerImage.image.defaultHost}}
<div class="amp-dc-banner-pic-wrap">
{{> bannerImage }}
</div>
<div class="amp-dc-banner-info-wrap
{{#if stackMobileLayout}}amp-dc-info-bottom{{/if}}
    {{#unless header}}
        {{#unless subheader}}
            {{#unless description}}
                {{#unless button.label}}
                    amp-dc-hide
                 {{/unless}}
            {{/unless}}
        {{/unless}}
    {{/unless}}"
     data-align="{{#if alignment}}{{alignment}}{{else}}left{{/if}}"
     style="
         {{#if textPositionLeft}}left:{{textPositionLeft}}%;{{/if}}
         {{#if textPositionTop}}top:{{textPositionTop}}%;{{/if}}"
>

    <div class="amp-dc-banner-info" data-opacity="{{bannerOpacity}}" data-color="{{bannerColor}}"
         data-txtcolor="{{textColour}}" style="">
        {{#if header}}
            <div class="amp-dc-banner-header">{{header}}</div>
        {{/if}}
        {{#if subheader}}
            <div class="amp-dc-banner-subheader">{{subheader}}</div>
        {{/if}}
        {{#if description}}
        {{bannerImage.image.defaultHost}}
            <div class="amp-dc-banner-description">{{description}}</div>
        {{/if}}
        {{#if button.label}}
            <a href="{{button.value}}"
               class="amp-dc-banner-button {{#if style}}{{style}}{{/if}}">{{button.label}}</a>
        {{/if}}
    </div>
</div>
</div>
`,
bannerImage:`{{#bannerImage}}
<picture class="amp-dc-image">
        <source srcset="//{{image.defaultHost}}/i/{{image.endpoint}}/{{escapeUrl image.name}}{{#if seoText}}/{{escapeUrl
            seoText}}{{/if}}.webp?w=1600&{{bannerPOI name=image.name w=1000 h=300 aspect='16:9'}}&{{bannerRoundel
            roundel}} 1x, //{{image.defaultHost}}/i/{{image.endpoint}}/{{escapeUrl
            image.name}}{{#if seoText}}/{{escapeUrl seoText}}{{/if}}.webp?w=3200&{{bannerPOI name=image.name w=2000 h=600
                                                                                             aspect='16:9'}}&{{bannerRoundel
            roundel aspectRatio="0.1"}} 2x"
                media="(min-width: 1280px)" type="image/webp">
        <source srcset="//{{image.defaultHost}}/i/{{image.endpoint}}/{{escapeUrl image.name}}{{#if seoText}}/{{escapeUrl
            seoText}}{{/if}}?w=1600&{{bannerPOI name=image.name w=1000 h=300 aspect='16:9'}}&{{bannerRoundel
            roundel}} 1x, //{{image.defaultHost}}/i/{{image.endpoint}}/{{escapeUrl image.name}}{{#if
            seoText}}/{{escapeUrl seoText}}{{/if}}?w=3200&{{bannerPOI name=image.name w=2000 h=600
                                                                      aspect='16:9'}}&{{bannerRoundel roundel aspectRatio="0.1"}} 2x"
                media="(min-width: 1280px)">

        <source srcset="//{{image.defaultHost}}/i/{{image.endpoint}}/{{escapeUrl image.name}}{{#if seoText}}/{{escapeUrl
            seoText}}{{/if}}.webp?w=1280&{{bannerPOI name=image.name w=1000 h=300 aspect='16:9'}}&{{bannerRoundel
            roundel}} 1x, //{{image.defaultHost}}/i/{{image.endpoint}}/{{escapeUrl
            image.name}}{{#if seoText}}/{{escapeUrl seoText}}{{/if}}.webp?w=2560&{{bannerPOI name=image.name w=1000 h=300
                                                                                             aspect='16:9'}}&{{bannerRoundel
            roundel aspectRatio="0.1"}} 2x"
                media="(min-width: 1024px)" type="image/webp">
        <source srcset="//{{image.defaultHost}}/i/{{image.endpoint}}/{{escapeUrl image.name}}{{#if seoText}}/{{escapeUrl
            seoText}}{{/if}}?w=1280&{{bannerPOI name=image.name w=1000 h=300 aspect='16:9'}}&{{bannerRoundel
            roundel}} 1x, //{{image.defaultHost}}/i/{{image.endpoint}}/{{escapeUrl image.name}}{{#if
            seoText}}/{{escapeUrl seoText}}{{/if}}?w=2560&{{bannerPOI name=image.name w=1000 h=300
                                                                      aspect='16:9'}}&{{bannerRoundel roundel aspectRatio="0.1"}} 2x"
                media="(min-width: 1024px)">

        <source srcset="//{{image.defaultHost}}/i/{{image.endpoint}}/{{escapeUrl image.name}}{{#if seoText}}/{{escapeUrl
            seoText}}{{/if}}.webp?w=1024&{{bannerPOI name=image.name w=1024 h=576 aspect='16:9'}}&{{bannerRoundel
            roundel}} 1x, //{{image.defaultHost}}/i/{{image.endpoint}}/{{escapeUrl
            image.name}}{{#if seoText}}/{{escapeUrl seoText}}{{/if}}.webp?w=2048&{{bannerPOI
            name=image.name w=2048 h=1152 aspect='16:9'}}&{{bannerRoundel roundel aspectRatio="0.15"}} 2x"
                media="(min-width: 769px)" type="image/webp">
        <source srcset="//{{image.defaultHost}}/i/{{image.endpoint}}/{{escapeUrl image.name}}{{#if seoText}}/{{escapeUrl
            seoText}}{{/if}}?w=1024&{{bannerPOI name=image.name name=image.name w=1024 h=576
                                                aspect='16:9'}}&{{bannerRoundel
            roundel}} 1x, //{{image.defaultHost}}/i/{{image.endpoint}}/{{escapeUrl image.name}}{{#if
            seoText}}/{{escapeUrl seoText}}{{/if}}?w=2048&{{bannerPOI name=image.name w=2048 h=1152
                                                                      aspect='16:9'}}&{{bannerRoundel roundel aspectRatio="0.15"}} 2x"
                media="(min-width: 769px)">

        <source srcset="//{{image.defaultHost}}/i/{{image.endpoint}}/{{escapeUrl image.name}}{{#if seoText}}/{{escapeUrl
            seoText}}{{/if}}.webp?w=768&{{bannerPOI name=image.name name=image.name w=768 h=768}}&{{bannerRoundel
            roundel}} 1x, //{{image.defaultHost}}/i/{{image.endpoint}}/{{escapeUrl
            image.name}}{{#if seoText}}/{{escapeUrl seoText}}{{/if}}.webp?w=1536&{{bannerPOI name=image.name
                                                                                             w=1536
                                                                                             h=1536}}&{{bannerRoundel
            roundel}} 2x"
                media="(max-width: 768px)" type="image/webp">
        <source srcset="//{{image.defaultHost}}/i/{{image.endpoint}}/{{escapeUrl image.name}}{{#if seoText}}/{{escapeUrl
            seoText}}{{/if}}?w=768&{{bannerPOI name=image.name name=image.name w=768 h=768}}&{{bannerRoundel
            roundel}} 1x, //{{image.defaultHost}}/i/{{image.endpoint}}/{{escapeUrl image.name}}{{#if
            seoText}}/{{escapeUrl seoText}}{{/if}}?w=1536&{{bannerPOI name=image.name w=1536 h=1536}}&{{bannerRoundel
            roundel}} 2x"
                media="(max-width: 768px)">

        <img src="//{{image.defaultHost}}/i/{{image.endpoint}}/{{escapeUrl image.name}}{{#if seoText}}/{{escapeUrl
            seoText}}{{/if}}?w=1600&{{bannerPOI name=image.name}}&{{bannerRoundel roundel}}"
                srcset="//{{image.defaultHost}}/i/{{image.endpoint}}/{{escapeUrl image.name}}{{#if seoText}}/{{escapeUrl
                 seoText}}{{/if}}.webp?w=1600&{{bannerPOI name=image.name}}&{{bannerRoundel
                 roundel}} 1x, //{{image.defaultHost}}/i/{{image.endpoint}}/{{escapeUrl
                 image.name}}{{#if seoText}}/{{escapeUrl seoText}}{{/if}}.webp?w=3200&{{bannerPOI
                 name=image.name}}&{{bannerRoundel roundel}} 2x,
             //{{image.defaultHost}}/i/{{image.endpoint}}/{{escapeUrl image.name}}{{#if seoText}}/{{escapeUrl
                 seoText}}{{/if}}?w=1600&{{bannerPOI name=image.name}}&{{bannerRoundel
                 roundel}} 1x, //{{image.defaultHost}}/i/{{image.endpoint}}/{{escapeUrl
                 image.name}}{{#if seoText}}/{{escapeUrl seoText}}{{/if}}?w=3200&{{bannerPOI
                 name=image.name}}&{{bannerRoundel roundel}} 2x"
                class="amp-dc-image-pic" {{#if imageAltText}} alt="{{imageAltText}}" {{/if}} />
</picture>{{/bannerImage}}`
};