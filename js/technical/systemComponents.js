var systemComponents = {
	'tab-buttons': {
		props: ['layer', 'data', 'name'],
		template: `
			<div class="upgRow">
				<div v-for="tab in Object.keys(data)">
					<button v-if="data[tab].unlocked == undefined || data[tab].unlocked" v-bind:class="{tabButton: true, notify: subtabShouldNotify(layer, name, tab), resetNotify: subtabResetNotify(layer, name, tab)}"
					v-bind:style="[{'border-color': tmp[layer].color}, (subtabShouldNotify(layer, name, tab) ? {'box-shadow': 'var(--hqProperty2a), 0 0 20px '  + (data[tab].glowColor || defaultGlow)} : {}), tmp[layer].componentStyles['tab-button'], data[tab].buttonStyle]"
						v-on:click="function(){player.subtabs[layer][name] = tab; updateTabFormats(); needCanvasUpdate = true;}">{{tab}}</button>
				</div>
			</div>
		`
	},

	'tree-node': {
		props: ['layer', 'abb', 'size', 'prev'],
		template: `
		<button v-if="nodeShown(layer)"
			v-bind:id="layer"
			v-on:click="function() {
				if (shiftDown && options.forceTooltips) player[layer].forceTooltip = !player[layer].forceTooltip
				else if(tmp[layer].isLayer) {
					if (tmp[layer].leftTab) {
						showNavTab(layer, prev)
						showTab('none')
					}
					else
						showTab(layer, prev)
				}
				else {run(layers[layer].onClick, layers[layer])}
			}"


			v-bind:class="{
				treeNode: tmp[layer].isLayer,
				treeButton: !tmp[layer].isLayer,
				smallNode: size == 'small',
				[layer]: true,
				tooltipBox: true,
				forceTooltip: player[layer].forceTooltip,
				ghost: tmp[layer].layerShown == 'ghost',
				hidden: !tmp[layer].layerShown,
				locked: tmp[layer].isLayer ? !(player[layer].unlocked || tmp[layer].canReset) : !(tmp[layer].canClick),
				notify: tmp[layer].notify && player[layer].unlocked,
				resetNotify: tmp[layer].prestigeNotify,
				can: ((player[layer].unlocked || tmp[layer].canReset) && tmp[layer].isLayer) || (!tmp[layer].isLayer && tmp[layer].canClick),
				front: !tmp.scrolled,
			}"
			v-bind:style="constructNodeStyle(layer)">
			<span class="nodeLabel" v-html="(abb !== '' && tmp[layer].image === undefined) ? abb : '&nbsp;'"></span>
			<tooltip
      v-if="tmp[layer].tooltip != ''"
			:text="(tmp[layer].isLayer) ? (
				player[layer].unlocked ? (tmp[layer].tooltip ? tmp[layer].tooltip : formatWhole(player[layer].points) + ' ' + tmp[layer].resource)
				: (tmp[layer].tooltipLocked ? tmp[layer].tooltipLocked : '需要 ' + formatWhole(tmp[layer].requires) + ' ' + tmp[layer].baseResource + ' 去解锁 ')
			)
			: (
				tmp[layer].canClick ? (tmp[layer].tooltip ? tmp[layer].tooltip : 'I am a button!')
				: (tmp[layer].tooltipLocked ? tmp[layer].tooltipLocked : 'I am a button!')
			)"></tooltip>
			<node-mark :layer='layer' :data='tmp[layer].marked'></node-mark></span>
		</button>
		`
	},

	
	'layer-tab': {
		props: ['layer', 'back', 'spacing', 'embedded'],
		template: `<div v-bind:style="[tmp[layer].style ? tmp[layer].style : {}, (tmp[layer].tabFormat && !Array.isArray(tmp[layer].tabFormat)) ? tmp[layer].tabFormat[player.subtabs[layer].mainTabs].style : {}]" class="noBackground">
		<div v-if="back"><button v-bind:class="back == 'big' ? 'other-back' : 'back'" v-on:click="goBack(layer)">←</button></div>
		<div v-if="!tmp[layer].tabFormat">
			<div v-if="spacing" v-bind:style="{'height': spacing}" :key="this.$vnode.key + '-spacing'"></div>
			<infobox v-if="tmp[layer].infoboxes" :layer="layer" :data="Object.keys(tmp[layer].infoboxes)[0]":key="this.$vnode.key + '-info'"></infobox>
			<main-display v-bind:style="tmp[layer].componentStyles['main-display']" :layer="layer"></main-display>
			<div v-if="tmp[layer].type !== 'none'">
				<prestige-button v-bind:style="tmp[layer].componentStyles['prestige-button']" :layer="layer"></prestige-button>
			</div>
			<resource-display v-bind:style="tmp[layer].componentStyles['resource-display']" :layer="layer"></resource-display>
			<milestones v-bind:style="tmp[layer].componentStyles.milestones" :layer="layer"></milestones>
			<div v-if="Array.isArray(tmp[layer].midsection)">
				<column :layer="layer" :data="tmp[layer].midsection" :key="this.$vnode.key + '-mid'"></column>
			</div>
			<clickables v-bind:style="tmp[layer].componentStyles['clickables']" :layer="layer"></clickables>
			<buyables v-bind:style="tmp[layer].componentStyles.buyables" :layer="layer"></buyables>
			<upgrades v-bind:style="tmp[layer].componentStyles['upgrades']" :layer="layer"></upgrades>
			<challenges v-bind:style="tmp[layer].componentStyles['challenges']" :layer="layer"></challenges>
			<achievements v-bind:style="tmp[layer].componentStyles.achievements" :layer="layer"></achievements>
			<br><br>
		</div>
		<div v-if="tmp[layer].tabFormat">
			<div v-if="Array.isArray(tmp[layer].tabFormat)"><div v-if="spacing" v-bind:style="{'height': spacing}"></div>
				<column :layer="layer" :data="tmp[layer].tabFormat" :key="this.$vnode.key + '-col'"></column>
			</div>
			<div v-else>
				<div class="upgTable" v-bind:style="{'padding-top': (embedded ? '0' : '25px'), 'margin-top': (embedded ? '-10px' : '0'), 'margin-bottom': '24px'}">
					<tab-buttons v-bind:style="tmp[layer].componentStyles['tab-buttons']" :layer="layer" :data="tmp[layer].tabFormat" :name="'mainTabs'"></tab-buttons>
				</div>
				<layer-tab v-if="tmp[layer].tabFormat[player.subtabs[layer].mainTabs].embedLayer" :layer="tmp[layer].tabFormat[player.subtabs[layer].mainTabs].embedLayer" :embedded="true" :key="this.$vnode.key + '-' + layer"></layer-tab>
				<column v-else :layer="layer" :data="tmp[layer].tabFormat[player.subtabs[layer].mainTabs].content" :key="this.$vnode.key + '-col'"></column>
			</div>
		</div></div>
			`
	},

	'overlay-head': {
		template: `			
		<div class="overlayThing" style="padding-bottom:7px; width: 90%; z-index: 1000; position: relative">
		<span v-if="player.devSpeed && player.devSpeed != 1" class="overlayThing">
			<br>Dev Speed: {{format(player.devSpeed)}}x<br>
		</span>
		<span v-if="player.offTime !== undefined"  class="overlayThing">
			<br>Offline Time: {{formatTime(player.offTime.remain)}}<br>
		</span>
		<span v-if="!options.tip" class="overlayThing">(tip:你可以在设置里关闭快捷资源显示,包括其单独项以及此提示)<br></span>
		<span v-if="options.offlineProd" class="overlayThing"><h1>!!!你的游戏出现了问题,请在设置中修复,如果资源达到负数请在设置中修复后点击'点数清零'(如果之后还有问题请联系作者(QQ:67265011))!!!</h1><br></span>
		<span v-if="!options.all && !options.qu && player.qu.points.gt(0) || options.always_all && !options.qu" class="overlayThing">你有 {{format(player.qu.points,0)}} / {{format(player.qu.goals[0],0)}} 夸克<br></span>
		<span v-if="!options.all && !options.cb && player.cb.points.gt(0) || options.always_all && !options.cb"  class="overlayThing">你有 <points id="pointscb">{{format(player.cb.points)}}</points> / <points id="pointscb">{{format(player.cb.pointscap)}}</points>(软上限) 泡沫点数<br></span>
		<span v-if="!options.all && !options.b && player.b.points.gt(0) || options.always_all && !options.b"  class="overlayThing">你有 <points id="pointsb">{{format(player.b.points)}}</points> 增强器<br></span>
		<span v-if="!options.all && !options.b_energy && player.b.energy.gt(0) || options.always_all && !options.b_energy"  class="overlayThing">你有 <points id="pointsb">{{format(player.b.energy)}}</points> 增强能量<br></span>
		<span v-if="!options.all && !options.b_energy2 && player.b.energy2.gt(0) || options.always_all && !options.b_energy2"  class="overlayThing">你有 <points id="pointsb">{{format(player.b.energy2)}}</points> 增强核能<br></span>
		<span v-if="!options.all && !options.s && player.s.points.gt(0) || options.always_all && !options.s"  class="overlayThing">你有 <points id="pointss">{{format(player.s.points)}}</points> & <points id="pointss">{{format(getBuyableAmount("s",11),0)}}</points> / 碎片 & 碎片阶级<br></span>
		<span v-if="!options.all && !options.i_landy && player.i.stage.gte(1) && player.i.gamemode.eq(2) || options.always_all && !options.i_landy"  class="overlayThing">你还有 {{format(player.i.timelast)}} 时间进行珠宝挑战<br></span>
		<span v-if="!options.all && !options.i && player.i.points.gt(0) || options.always_all && !options.i"  class="overlayThing">你有 <points id="pointsi">{{format(player.i.points)}}</points> 珠宝点数<br></span>
		<span v-if="canGenPoints()"  class="overlayThing">({{tmp.other.oompsMag != 0 ? format(tmp.other.oomps) + " OOM" + (tmp.other.oompsMag < 0 ? "^OOM" : tmp.other.oompsMag > 1 ? "^" + tmp.other.oompsMag : "") + "s" : formatSmall(getPointGen())}}/sec)</span>
		<div v-for="thing in tmp.displayThings" class="overlayThing"><span v-if="thing" v-html="thing"></span></div>
	</div>
	`
    },

    'info-tab': {
        template: `
        <div>
        <h2>{{modInfo.name}}</h2>
        <br>
        <h3>{{VERSION.withName}}</h3>
        <span v-if="modInfo.author">
            <br>
            Made by {{modInfo.author}}	
        </span>
        <br>
        The Modding Tree <a v-bind:href="'https://github.com/Acamaeda/The-Modding-Tree/blob/master/changelog.md'" target="_blank" class="link" v-bind:style = "{'font-size': '14px', 'display': 'inline'}" >{{TMT_VERSION.tmtNum}}</a> by Acamaeda
        <br>
        The Prestige Tree made by Jacorb and Aarex
		<br><br>
		<div class="link" onclick="showTab('changelog-tab')">Changelog</div><br>
        <span v-if="modInfo.discordLink"><a class="link" v-bind:href="modInfo.discordLink" target="_blank">{{modInfo.discordName}}</a><br></span>
        <a class="link" href="https://discord.gg/F3xveHV" target="_blank" v-bind:style="modInfo.discordLink ? {'font-size': '16px'} : {}">The Modding Tree Discord</a><br>
        <a class="link" href="http://discord.gg/wwQfgPa" target="_blank" v-bind:style="{'font-size': '16px'}">Main Prestige Tree server</a><br>
		<br><br>
        Time Played: {{ formatTime(player.timePlayed) }}<br><br>
        <h3>Hotkeys</h3><br>
        <span v-for="key in hotkeys" v-if="player[key.layer].unlocked && tmp[key.layer].hotkeys[key.id].unlocked"><br>{{key.description}}</span></div>
    `
    },

    'options-tab': {
        template: `
        <table>
            <tr>
                <td><button class="opt" onclick="save()">保存</button></td>
                <td><button class="opt" onclick="toggleOpt('autosave')">自动保存: {{ options.autosave?"开":"关" }}</button></td>
                <td><button class="opt" onclick="hardReset()">硬重置</button></td>
            </tr>
            <tr>
                <td><button class="opt" onclick="exportSave()">导出到剪贴板</button></td>
                <td><button class="opt" onclick="importSave()">导入</button></td>
                <td><button class="opt" onclick="toggleOpt('offlineProd')" v-if="options.offlineProd">一键修正游戏: {{ options.offlineProd?"点我修正游戏,正常修正后不会显示此选项":"点我修正游戏,正常修正后不会显示此选项" }}</button></td>
				<td><button class="optred" onclick="player.b.points = new Decimal(0);player.b.energy = new Decimal(0);player.b.booster = new Decimal(0);player.s.points = new Decimal(0);player.i.points = new Decimal(0);player.qu.goals[0] = new Decimal(0);player.qu.goals[1] = new Decimal(0);player.qu.goals[2] = new Decimal(0);player.qu.goals[3] = new Decimal(0);player.qu.goals[4] = new Decimal(0);player.qu.tip = new Decimal(0);player.qu.points = new Decimal(0);player.cb.points = new Decimal(0);" v-if="!options.offlineProd"><h6>点数清零(若游戏没有问题请不要点)<br>点击前请先重置夸克和碎片购买,之后多点几次.联系作者:QQ67265011</h6></button></td>
            <tr>
                <td><button class="opt" onclick="switchTheme()">主题: {{ getThemeName() }}</button></td>
                <td><button class="opt" onclick="adjustMSDisp()">显示里程碑: {{ MS_DISPLAYS[MS_SETTINGS.indexOf(options.msDisplay)]}}</button></td>
                <td><button class="opt" onclick="toggleOpt('hqTree')">高质量树: {{ options.hqTree?"开":"关" }}</button></td>
            </tr>
            <tr>
                <td><button class="opt" onclick="toggleOpt('hideChallenges')">显示完成的挑战: {{ options.hideChallenges?"显示":"隐藏" }}</button></td>
                <td><button class="opt" onclick="toggleOpt('forceOneTab'); needsCanvasUpdate = true">单标签模式: {{ options.forceOneTab?"总是":"自动" }}</button></td>
				<td><button class="optsub"class="opt" onclick="toggleOpt('forceTooltips'); needsCanvasUpdate = true">shift点击层来保留横幅显示: {{ options.forceTooltips?"开":"关" }}</button></td>
			</tr>
			<br>
			<tr>
				<td><button class="opt" onclick="toggleOpt('all')">显示便捷资源显示: {{ options.all?"关":"开" }}</button></td>
				<td><button v-if="!options.all || options.always_all" class="opt" onclick="toggleOpt('always_all')">总是显示便捷资源显示(注:会剧透): {{ options.always_all?"开":"关" }}</button></td>
				<td><button class="opt" onclick="toggleOpt('tip')">显示tip: {{ options.tip?"关":"开" }}</button></td>
			</tr>
			<tr>
				<td><button v-if="!options.all && player.qu.points.gt(0) || options.always_all" class="optsub" onclick="toggleOpt('qu')">夸克快捷显示: {{ options.qu?"关":"开" }}</button></td>
				<td><button v-if="!options.all && player.cb.points.gt(0) || options.always_all" class="optsub" onclick="toggleOpt('cb')">宇宙泡沫快捷显示: {{ options.cb?"关":"开" }}</button></td>
				<td><button v-if="!options.all && player.b.points.gt(0) || options.always_all" class="optsub" onclick="toggleOpt('b')">增强器快捷显示: {{ options.b?"关":"开" }}</button></td>
			</tr>
			<tr>
				<td><button v-if="!options.all && player.b.energy.gt(0) || options.always_all" class="optsub" onclick="toggleOpt('b_energy')">增强能量快捷显示: {{ options.b_energy?"关":"开" }}</button></td>
				<td><button v-if="!options.all && player.s.points.gt(0) || options.always_all" class="optsub" onclick="toggleOpt('s')">碎片快捷显示: {{ options.s?"关":"开" }}</button></td>
				<td><button v-if="!options.all && player.i.stage.gte(1) || options.always_all" class="optsub" onclick="toggleOpt('i_landy')">珠宝挑战剩余时间快捷显示: {{ options.i_landy?"关":"开" }}</button></td>
			</tr>
			<tr>
				<td><button v-if="!options.all && player.i.points.gt(0) || options.always_all" class="optsub" onclick="toggleOpt('i')">珠宝点数快捷显示: {{ options.i?"关":"开" }}</button></td>
				<td><button v-if="!options.all && player.b.energy2.gt(0) || options.always_all" class="optsub" onclick="toggleOpt('b_energy2')">增强核能快捷显示: {{ options.b_energy2?"关":"开" }}</button></td>
			</tr>
        </table>`
    },

    'back-button': {
        template: `
        <button v-bind:class="back" onclick="goBack()">←</button>
        `
    },


	'tooltip' : {
		props: ['text'],
		template: `<div class="tooltip" v-html="text"></div>
		`
	},

	'node-mark': {
		props: {'layer': {}, data: {}, offset: {default: 0}, scale: {default: 1}},
		template: `<div v-if='data'>
			<div v-if='data === true' class='star' v-bind:style='{position: "absolute", left: (offset-10) + "px", top: (offset-10) + "px", transform: "scale( " + scale||1 + ", " + scale||1 + ")"}'></div>
			<img v-else class='mark' v-bind:style='{position: "absolute", left: (offset-22) + "px", top: (offset-15) + "px", transform: "scale( " + scale||1 + ", " + scale||1 + ")"}' v-bind:src="data"></div>
		</div>
		`
	},

	'particle': {
		props: ['data', 'index'],
		template: `<div><div class='particle instant' v-bind:style="[constructParticleStyle(data), data.style]" 
			v-on:click="run(data.onClick, data)"  v-on:mouseenter="run(data.onMouseOver, data)" v-on:mouseleave="run(data.onMouseLeave, data)" ><span v-html="data.text"></span>
		</div>
		<svg version="2" v-if="data.color">
		<mask v-bind:id="'pmask' + data.id">
        <image id="img" v-bind:href="data.image" x="0" y="0" :height="data.width" :width="data.height" />
    	</mask>
    	</svg>
		</div>
		`
	},

	'bg': {
		props: ['layer'],
		template: `<div class ="bg" v-bind:style="[tmp[layer].style ? tmp[layer].style : {}, (tmp[layer].tabFormat && !Array.isArray(tmp[layer].tabFormat)) ? tmp[layer].tabFormat[player.subtabs[layer].mainTabs].style : {}]"></div>
		`
	}

}

