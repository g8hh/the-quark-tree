function keeper(input,toKeep){
	var output = []
	for(i in toKeep){
		i = toKeep[Number(i)]
		if(input.includes(i)) output.push(i)
	}
	return output
}

addLayer("qu", {
    name: "quark",
    symbol: "QU",
    position: 0,
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        goals: [new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0)],
		pointsbest: new Decimal(0),
		tip: new Decimal(0),
    }},
    color: "#ffffff",
    resource: "夸克",
    type: "none",
    row: "side",
    layerShown(){return true},
	buyables: {
		showRespec: true,
        respec() {
			setBuyableAmount("qu",11, new Decimal(0))
			setBuyableAmount("qu",12, new Decimal(0))
			setBuyableAmount("qu",13, new Decimal(0))
			player.qu.points = new Decimal(player.qu.goals[0])
			player.qu.tip = new Decimal(0)
			if(!hasChallenge("cb",11)){player.cb.points = new Decimal(0)}
			player.b.points = new Decimal(0)
			player.b.energy = new Decimal(0)
			player.b.booster = new Decimal(0)
			player.s.points = new Decimal(0)
			player.s.haveupgrades = new Decimal(0)
		},
		respecText: "重置夸克购买",
		11: {
			cost(x) { 
				return new Decimal(x).mul(2).pow(2).add(x)
			},
			title:"夸克购买I 阶层",
			display() { return "解锁一个新层<br><br>"+"需要:"+format(this.cost(),0)+"夸克<br>目前数量:"+format(getBuyableAmount(this.layer, this.id),0)+"个<br>目前效果:<br>+"+format(getBuyableAmount(this.layer, this.id),0)+"阶层"},
			canAfford() { return player[this.layer].points.gte(this.cost()) },
			buy() {
				player[this.layer].points = player[this.layer].points.sub(this.cost())
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
				player.qu.tip = player.qu.tip.add(this.cost())
			},
			unlocked(){return true},
		},
		12: {
			cost(x) { 
				return new Decimal(x).add(1)
			},
			title:"夸克购买II 泡沫",
			display() { return "提升宇宙泡沫获取<br><br>"+"需要:"+format(this.cost(),0)+"夸克<br>目前数量:"+format(getBuyableAmount(this.layer, this.id),0)+"个<br>目前效果:<br>+"+format(buyableEffect(this.layer, this.id),0)+"倍获取"},
			canAfford() { return player[this.layer].points.gte(this.cost()) },
			buy() {
				player[this.layer].points = player[this.layer].points.sub(this.cost())
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
			},
			effect(x) {
				let eff = new Decimal(2)
				eff = eff.pow(x)
				if(hasUpgrade("cb",61)){eff = eff.pow(1.5)}
				if(hasUpgrade("cb",25)){eff = eff.pow(1.5)}
				return eff
			},
			unlocked(){return hasUpgrade("cb",14) || getBuyableAmount(this.layer, this.id).gte(1)},
		},
		13: {
			cost(x) { 
				return new Decimal(x).add(1)
			},
			title:"夸克购买III 增强",
			display() { 
				let start = "降低增强基础获取需求<br><br>"+"需要:"+format(this.cost(),0)+"夸克<br>目前数量:"+format(getBuyableAmount(this.layer, this.id),0)+"个<br>"
				let effect =  "目前效果:<br>/"+format(buyableEffect(this.layer, this.id))+"倍基础获取需求<br>"
				let effect2 = hasUpgrade("b",12) ? "+"+format(player.b.energyget)+"增强能量生产" : ""
				return start + effect + effect2
			},
			canAfford() { return player[this.layer].points.gte(this.cost()) },
			buy() {
				player[this.layer].points = player[this.layer].points.sub(this.cost())
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
			},
			effect(x) {
				let eff = new Decimal(1).add(x)
				eff = eff.pow(Decimal.add(x).mul(0.3))
				if(hasUpgrade("cb",61)){eff = eff.pow(1.5)}
				return eff
			},
			unlocked(){return hasUpgrade("b",11) || getBuyableAmount(this.layer, this.id).gte(1)},
		},
		21: {
			cost(x) { 
				return new Decimal(x).add(1).mul(25).sub(Decimal.add(x).mul(15))
			},
			title:"夸克购买IV 碎片",
			display() { 
				let start = "降低碎片升级需求<br><br>"+"需要:"+format(this.cost(),0)+"夸克<br>目前数量:"+format(getBuyableAmount(this.layer, this.id),0)+"个<br>"
				let effect =  "目前效果:<br>-"+format(getBuyableAmount(this.layer, this.id),0)+"碎片升级需求<br>"
				return start + effect
			},
			canAfford() { return player[this.layer].points.gte(this.cost()) },
			buy() {
				player[this.layer].points = player[this.layer].points.sub(this.cost())
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
			},
			unlocked(){return hasUpgrade("s",23) || getBuyableAmount(this.layer, this.id).gte(1)},
		},
	},
	bars: {
		bigBar0: {
			display() {return "距离获得下一个夸克 "+format(player.cb.points)+" / "+format(this.goal())+" 宇宙泡沫(已获得"+format(player.qu.goals[1],0)+"个)"},	
			direction: RIGHT,
			width: 500,
			height: 50,
			progress() { return {} },
			unlocked(){return getBuyableAmount("qu",11).gte(1) || hasUpgrade("cb",11)},
			goal(){
				let goal = Decimal.add(10).mul(player.qu.goals[1]).pow(Decimal.add(2).mul(player.qu.goals[1]).mul(0.595))
				if(hasUpgrade("cb",15)){goal = goal.pow(0.5)}
				return goal
			},
			progress(){
				if(player.cb.points.gte(this.goal())){
					player.qu.goals[1] = player.qu.goals[1].add(1)
					player.qu.goals[0] = player.qu.goals[0].add(1)
					player.qu.points = player.qu.points.add(1)
				}else{
					return (player.cb.points.div(this.goal())).toNumber()
				}
			},
			baseStyle: {
				"background-color": "#FFFFFF"
			},
			fillStyle: {
				"background-color": "#55a8cd"
			},
			textStyle: {
				"color": "#000000"
			}
		},
		bigBar1: {
			display() {return "距离获得下一个夸克 "+format(player.b.pointsadd)+" / "+format(this.goal())+" 增强器总加成(已获得"+format(player.qu.goals[2],0)+"个)"},	
			direction: RIGHT,
			width: 500,
			height: 50,
			progress() { return {} },
			unlocked(){return getBuyableAmount("qu",11).gte(2)},
			goal(){
				let goal = Decimal.add(1).mul(player.qu.goals[2].add(1).mul(4)).pow(Decimal.add(1).add(player.qu.goals[2].mul(0.1)))
				return goal
			},
			progress(){
				if(player.b.pointsadd.gte(this.goal())){
					player.qu.goals[2] = player.qu.goals[2].add(1)
					player.qu.goals[0] = player.qu.goals[0].add(1)
					player.qu.points = player.qu.points.add(1)
				}else{
					return (player.b.pointsadd.div(this.goal())).toNumber()
				}
			},
			baseStyle: {
				"background-color": "#FFFFFF"
			},
			fillStyle: {
				"background-color": "#4BDC59"
			},
			textStyle: {
				"color": "#000000"
			}
		},
		bigBar2: {
			display() {return "距离获得三个夸克 "+format(player.s.haveupgrades,0)+" / "+format(this.goal(),0)+" 碎片升级(已获得"+format(player.qu.goals[3],0)+"个)"},	
			direction: RIGHT,
			width: 500,
			height: 50,
			progress() { return {} },
			unlocked(){return getBuyableAmount("qu",11).gte(3)},
			goal(){
				let goal = Decimal.add(2).pow(player.qu.goals[3].div(3))
				return goal
			},
			progress(){
				if(player.s.haveupgrades.gte(this.goal())){
					player.qu.goals[3] = player.qu.goals[3].add(3)
					player.qu.goals[0] = player.qu.goals[0].add(3)
					player.qu.points = player.qu.points.add(3)
				}else{
					return (player.s.haveupgrades.div(this.goal())).toNumber()
				}
			},
			baseStyle: {
				"background-color": "#FFFFFF"
			},
			fillStyle: {
				"background-color": "#f2f2f2"
			},
			textStyle: {
				"color": "#000000"
			}
		},
		bigBar3: {
			display() {return "距离获得下一个夸克 "+format(player.b.points)+" / "+format(this.goal())+" 增强器(已获得"+format(player.qu.goals[4],0)+"个)"},	
			direction: RIGHT,
			width: 500,
			height: 50,
			progress() { return {} },
			unlocked(){return hasUpgrade("b",15) && getBuyableAmount("qu",11).gte(2)},
			goal(){
				let goal = Decimal.add(12).mul(player.qu.goals[4].add(1).pow(0.5))
				return goal
			},
			progress(){
				if(player.b.points.gte(this.goal()) && hasUpgrade("b",15)){
					player.qu.goals[4] = player.qu.goals[4].add(1)
					player.qu.goals[0] = player.qu.goals[0].add(1)
					player.qu.points = player.qu.points.add(1)
				}else{
					return (player.b.points.div(this.goal())).toNumber()
				}
			},
			baseStyle: {
				"background-color": "#FFFFFF"
			},
			fillStyle: {
				"background-color": "#4BDC59"
			},
			textStyle: {
				"color": "#000000"
			}
		},
	},
	tabFormat: [
		"blank",
		['display-text',function(){return `<h3>你有 `+format(player.qu.points,0)+` / `+format(player.qu.goals[0],0)+` 夸克`}],
		['display-text',function(){return `<h6>tip:夸克购买重置会保留所有层的升级<br><h6>`}],
		['display-text',function(){return `<h6>tip2:你需要总共 `+format(player.qu.tip,0)+` 个夸克才能购买下个夸克购买I<br><h6>`}],
		['display-text',function(){return hasUpgrade("cb",14) || getBuyableAmount("qu",12).gte(1) ? `<h6>tip3:当你拥有一个类型的夸克购买项之后它将持续解锁(如:你有一个夸克购买II,即使你没有'夸克魔力'升级夸克购买II也会持续解锁)<br><h6>` : ``}],
		['display-text',function(){return hasChallenge("cb",12) ? `<h6>tip4:在挑战'无增强'中无法获得根据增强器数量获得夸克的进度<br><h6>` : ``}],
		"blank",
		"blank",
		"blank",
		"blank",
		["row", [["bar", "bigBar0"]]],
		["row", [["bar", "bigBar1"]]],
		["row", [["bar", "bigBar3"]]],
		["row", [["bar", "bigBar2"]]],
		"blank",
		"blank",
		"blank",
		"blank",
		"blank",
		"blank",
		"blank",
		"buyables",
	]
})

addLayer("cb", {
    name: "cosmic bubble",
    symbol: "CB",
    position: 0,
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
		pointsget: new Decimal(0),
		pointsparticularly: new Decimal(0),
		pointscap: new Decimal(0),
		pointsbooster: new Decimal(0),
    }},
    color: "#55a8cd",
    requires: new Decimal(10),
    resource: "宇宙泡沫",
    type: "none",
    row: 0,
    layerShown(){return getBuyableAmount("qu",11).gte(1) || hasChallenge("cb",11)},
	update(diff){
		var s24 = hasUpgrade("s",24) ? new Decimal(1.5) : new Decimal(1)
		var s25 = hasUpgrade("s",25) ? new Decimal(0.75) : new Decimal(1)
		var pointsgetformula = new Decimal(0).add(upgradeEffect("cb", 11)).add(upgradeEffect("cb", 12)).mul(upgradeEffect("cb", 13)).mul(upgradeEffect("cb", 21)).mul(buyableEffect("qu", 12)).mul(player.b.pointsadd).pow(s24).pow(s25)
		var pointsboosterformula = new Decimal.min(Decimal.add(2).pow(player.cb.points.pow(0.05).add(1)).mul(20).add(1),Decimal.add(10000).mul(player.cb.points.pow(0.01).add(1)))
		if(hasChallenge("cb",11)){player.cb.pointsbooster = new Decimal(pointsboosterformula)}
		player.cb.pointsget = new Decimal(pointsgetformula).mul(player.cb.pointsbooster)
		player.cb.pointsparticularly = new Decimal(pointsgetformula).mul(player.cb.pointsbooster).mul(0.1)
		if(!inChallenge("cb",11)){player.cb.points = player.cb.points.add(Decimal.add(player.cb.pointsget).mul(diff))}
		if(!inChallenge("cb",11)){player.cb.points = player.cb.points.add(Decimal.add(player.cb.pointsparticularly).mul(diff))}
		if(inChallenge("cb",11) && hasUpgrade("s",13)){player.cb.points = player.cb.points.add(Decimal.add(player.cb.pointsparticularly).pow(0.25).div(player.cb.points.add(1)).pow(upgradeEffect("cb",64)).mul(diff))}
		if(inChallenge("cb",11) && hasUpgrade("cb",71)){player.cb.points = player.cb.points.add(Decimal.add(player.cb.pointsparticularly).pow(0.25).div(player.cb.points.add(1)).pow(upgradeEffect("cb",64)).mul(0.1).mul(diff))}
		player.cb.pointscap = new Decimal("1e15")
		if(player.cb.points.gt(player.cb.pointscap)){player.cb.points = player.cb.points.sub(player.cb.points.sub(player.cb.pointscap).mul(0.69).mul(diff))}
		if(player.cb.points.lt(0)){player.cb.points = new Decimal(0)}
	},
	doReset(resettingLayer) {
		let keep = [];
		keep.push("challenges");
		if (layers[resettingLayer].row > this.row) layerDataReset("cb", keep);
	},
	upgrades:{
		11:{
			title: "宇宙",
			description: "宇宙里的泡沫,你可以获得宇宙泡沫<br>",
			cost: new Decimal(0),
			effect(){
				let eff = new Decimal(0)
				if(hasUpgrade("cb",11)){eff = Decimal.add(1)}
				return eff
			},
			effectDisplay() { return "+"+format(upgradeEffect(this.layer, this.id))+"宇宙泡沫获取" },
		},
		12:{
			title: "老升级了",
			description: "为什么树游戏的升级都如此雷同?<br>宇宙泡沫增加宇宙泡沫生产<br>",
			cost: new Decimal(10),
			effect(){
				let eff = new Decimal(0)
				if(hasUpgrade("cb",12)){eff = player[this.layer].points.pow(0.2)}
				if(hasUpgrade("cb",63)){eff = eff.pow(upgradeEffect("cb",63))}
				return eff
			},
			effectDisplay() { return "+"+format(upgradeEffect(this.layer, this.id))+"宇宙泡沫获取" },
			unlocked(){return hasUpgrade("cb",11) || inChallenge("cb",11)},
		},
		13:{
			title: "泡沫膨胀",
			description: "谁知道呢?<br>三倍宇宙泡沫生产<br>",
			cost: new Decimal(30),
			effect(){
				let eff = new Decimal(1)
				if(hasUpgrade("cb",13)){eff = new Decimal(3)}
				if(hasUpgrade("cb",62)){eff = new Decimal(3000)}
				return eff
			},
			unlocked(){return hasUpgrade("cb",12) || inChallenge("cb",11)},
		},
		14:{
			title: "夸克魔力",
			description: "或许是因为没有比那些更合适的升级了<br>解锁夸克购买II<br>",
			cost: new Decimal(100),
			unlocked(){return hasUpgrade("cb",13) || inChallenge("cb",11)},
		},
		15:{
			title: "更多夸克",
			description: "又或者是人们早已习惯用和看到这些升级<br>宇宙泡沫夸克获取进度公式增加 ^0.5<br>(原公式) -> (原公式)^0.5",
			cost: new Decimal(2000),
			unlocked(){return hasUpgrade("cb",14) || inChallenge("cb",11)},
		},
		21:{
			title: "夸克加成",
			description(){	
				let start = "每个夸克都会使你的宇宙泡沫生产*2<br>"
				let effect = upgradeEffect(this.layer, this.id).gte(1000) && upgradeEffect(this.layer, this.id).lt(5000) ? "(软上限)<br>" : ""
				let effect2 = upgradeEffect(this.layer, this.id).gte(5000) && upgradeEffect(this.layer, this.id).lt(15000) ? "(双重软上限)<br>" : ""
				let effect3 = upgradeEffect(this.layer, this.id).gte(15000) ? "(三重软上限)<br>" : ""
				return start + effect + effect2 + effect3
			},
			cost: new Decimal(100000),
			effect(){
				let eff = new Decimal(1)
				if(hasUpgrade("cb",21)){eff = new Decimal(Decimal.add(2).pow(player.qu.goals[0]))}
				eff = softcap(eff,new Decimal(1000),0.2)
				eff = softcap(eff,new Decimal(5000),0.2)
				eff = softcap(eff,new Decimal(15000),0.2)
				return eff
			},
			effectDisplay() { return hasUpgrade("cb",21) ? "*"+format(upgradeEffect(this.layer, this.id))+"宇宙泡沫获取" : "未购买此升级"},
			unlocked(){return player.b.points.gte(1) || hasUpgrade("cb",21) || inChallenge("cb",11)},
		},
		22:{
			title: "双向碎片",
			description(){	
				let start = "根据宇宙泡沫略微降低碎片需求<br>"
				let effect = upgradeEffect(this.layer, this.id).gte(1.1) && upgradeEffect(this.layer, this.id).lt(1.5) ? "(软上限)<br>" : ""
				let effect2 = upgradeEffect(this.layer, this.id).gte(1.5) && upgradeEffect(this.layer, this.id).lt(1) ? "(双重递增软上限)<br>" : ""
				let effect3 = upgradeEffect(this.layer, this.id).gte(2) ? "(三重递增软上限)<br>" : ""
				return start + effect + effect2 + effect3
			},
			cost: new Decimal(3e12),
			effect(){
				let eff = new Decimal(player.cb.points).pow(0.325).pow(0.325).pow(0.325).add(1)
				eff = softcap(eff,new Decimal(1.1),0.3)
				eff = softcap(eff,new Decimal(1.5),0.1)
				eff = softcap(eff,new Decimal(2),0.01)
				return eff
			},
			effectDisplay() { return "/"+format(upgradeEffect(this.layer, this.id))+"碎片需求指数" },
			unlocked(){return hasUpgrade("s",11)},
		},
		23:{
			title: "又是什么令人难受的东西?",
			description: "这总是让人难受<br>解锁挑战",
			cost: new Decimal(1e13),
			unlocked(){return hasUpgrade("s",11)},
		},
		24:{
			title: "加倍后的减价",
			description(){	
				let start = "根据宇宙泡沫略微降低增强器需求<br>"
				let effect = upgradeEffect(this.layer, this.id).gte(1.05) && upgradeEffect(this.layer, this.id).lt(1.1) ? "(软上限)<br>" : ""
				let effect2 = upgradeEffect(this.layer, this.id).gte(1.1) && upgradeEffect(this.layer, this.id).lt(1.3) ? "(双重递增软上限)<br>" : ""
				let effect3 = upgradeEffect(this.layer, this.id).gte(1.3) ? "(三重递增软上限)<br>" : ""
				return start + effect + effect2 + effect3
			},
			cost: new Decimal(1e20),
			effect(){
				let eff = new Decimal(player.cb.points).add(1).log(10).pow(0.005).pow(0.005).pow(0.005).add(1)
				eff = softcap(eff,new Decimal(1.05),0.1)
				eff = softcap(eff,new Decimal(1.1),0.01)
				eff = softcap(eff,new Decimal(1.3),0.001)
				return eff
			},
			effectDisplay() { return "/"+format(upgradeEffect(this.layer, this.id),5)+"增强器需求指数" },
			unlocked(){return hasUpgrade("s",11)},
		},
		25:{
			title: "有些熟悉?",
			description: "你好像看过这个升级?又没完全看过?<br>夸克购买II效果^1.5",
			cost: new Decimal(1e22),
			unlocked(){return hasChallenge("cb",11) && player.cb.points.gte(1e22) || hasUpgrade("cb",25)},
		},
		61:{
			title: "*夸克助推器",
			description: "这种物质比你想象中的更能'吃',看来你需要一些夸克<br>夸克购买项II,III第一个效果变为1.5次方<br>(tip:带*的升级为特殊升级)",
			cost: new Decimal(6),
			unlocked(){return inChallenge("cb",11)},
		},
		62:{
			title: "*超负荷",
			description: "三倍有什么意思?<br>'泡沫膨胀'效果变为3000倍,且不需要购买'泡沫膨胀'也能获得'泡沫膨胀'的加成效果",
			cost: new Decimal(0),
			unlocked(){return inChallenge("cb",11) && hasUpgrade("cb",13) || hasUpgrade("cb",62)},
		},
		63:{
			title: "*新升级了",
			description(){	
				let start = "你必须提升效率,不然这个洞永远无法填满<br>'老升级了'被宇宙泡沫大幅度增加产量<br>"
				let effect = upgradeEffect(this.layer, this.id).gte(20) && upgradeEffect(this.layer, this.id).lt(25) ? "(软上限)<br>" : ""
				let effect2 = upgradeEffect(this.layer, this.id).gte(25) && upgradeEffect(this.layer, this.id).lt(25.25) ? "(双重软上限)<br>" : ""
				let effect3 = upgradeEffect(this.layer, this.id).gte(25.25) ? "(硬上限)<br>" : ""
				return start + effect + effect2 + effect3
			},
			cost: new Decimal(150),
			unlocked(){return inChallenge("cb",11) && player.cb.points.gte(100) || hasUpgrade("cb",63)},
			effect(){
				let eff = new Decimal(player[this.layer].points.pow(0.5))
				eff = softcap(eff,new Decimal(20),0.05)
				eff = softcap(eff,new Decimal(25),0.05)
				if(eff.gte(25.25)){eff = new Decimal(25.25)}
				return eff
			},
			effectDisplay() { return "^"+format(upgradeEffect(this.layer, this.id))+"'老升级了'效果" },
		},
		64:{
			title: "*升级不应该是无用的",
			description: "现在没有无用的升级了<br>每个泡沫升级都会使泡沫获取指数+0.04",
			cost: new Decimal(100000),
			unlocked(){return inChallenge("cb",11) && hasUpgrade("cb",14) && hasUpgrade("cb",15) || hasUpgrade("cb",64)},
			effect(){
				let eff = new Decimal(1)
				if(hasUpgrade("cb",64)){eff = new Decimal(player.cb.upgrades.length * 0.04 + 1)}
				return eff
			},
		},
		65:{
			title: "*新的方式",
			description: "你发现一种新的方式来或者增强器:利用洞的压力高度浓缩宇宙泡沫,随后宇宙泡沫会膨胀,崩塌,再进行加固获得增强器<br>解锁获取增强器按钮",
			cost: new Decimal(10000000),
			unlocked(){return inChallenge("cb",11) && player.cb.points.gte(1000000) || hasUpgrade("cb",65)},
		},
		71:{
			title: "*是时候放松一点了",
			description: "每秒格外获取1%的宇宙泡沫",
			cost: new Decimal(0.03),
			unlocked(){return inChallenge("cb",11) && player.b.points.gt(0) || hasUpgrade("cb",71)},
			style() {return {'border-color': "#4BDC59" }},
			currencyDisplayName:"增强器",
			currencyInternalName: "points",
			currencyLayer: "b",
		},
		72:{
			title: "*推新公式",
			description: "增强器获取更好",
			cost: new Decimal(0.07),
			unlocked(){return inChallenge("cb",11) && player.b.points.gte(0.05) || hasUpgrade("cb",72)},
			effect(){
				let eff = new Decimal(0.05)
				if(hasUpgrade("cb",72)){eff = new Decimal(0.07)}
				if(hasUpgrade("cb",74)){eff = new Decimal(0.3)}
				return eff
			},
			style() {return {'border-color': "#4BDC59" }},
			currencyDisplayName:"增强器",
			currencyInternalName: "points",
			currencyLayer: "b",
		},
		73:{
			title: "*翻新理论",
			description: "获取增强器时保留关于增强器的升级(即边框为绿色)",
			cost: new Decimal(0.15),
			unlocked(){return inChallenge("cb",11) && hasUpgrade("cb",72) || hasUpgrade("cb",73)},
			style() {return {'border-color': "#4BDC59" }},
			currencyDisplayName:"增强器",
			currencyInternalName: "points",
			currencyLayer: "b",
		},
		74:{
			title: "*准备",
			description: "这个洞好像要满了<br>大幅度提升'*推新公式'",
			cost: new Decimal(0.35),
			unlocked(){return inChallenge("cb",11) && hasUpgrade("cb",71) && hasUpgrade("cb",72) && hasUpgrade("cb",73) || hasUpgrade("cb",74)},
			style() {return {'border-color': "#4BDC59" }},
			currencyDisplayName:"增强器",
			currencyInternalName: "points",
			currencyLayer: "b",
		},
		75:{
			title: "*再见",
			description: "再见,这个难受的洞和这个难受的挑战<br>获取宇宙泡沫按钮最终获取*10000(tip:被动获取不吃这个加成)",
			cost: new Decimal(15),
			unlocked(){return inChallenge("cb",11) && hasUpgrade("cb",74) || hasUpgrade("cb",75)},
			effect(){
				let eff = new Decimal(1)
				if(hasUpgrade("cb",75)){eff = new Decimal(10000)}
				return eff
			},
			style() {return {'border-color': "#4BDC59" }},
			currencyDisplayName:"增强器",
			currencyInternalName: "points",
			currencyLayer: "b",
		},
	},
	challenges: {
		11: {
			name: "无泡沫",
			challengeDescription: "<h6>泡沫的膨胀导致宇宙出现混乱,一种新的物质吞噬了泡沫,你需要许多泡沫去填充那块领域.<br>挑战效果:禁用常规泡沫获取,解锁临时的获取宇宙泡沫按钮且泡沫获取变为原来的0.25次方.解锁泡沫特殊升级,泡沫增加泡沫的获取难度.<br>开启重置:重置宇宙泡沫 重置拥有的增强器和增强能量.<h6>",
			unlocked() { return hasUpgrade("cb",23) || inChallenge("cb",11) || hasChallenge("cb",11)},
			canComplete: function() {return player.cb.points.gte(1e15)},
			goalDescription:"<h6>1e15 宇宙泡沫<h6>",
			rewardDescription: "<h6>宇宙泡沫可以根据宇宙泡沫进行较大的加成,解锁按钮泡沫膨胀,重置夸克时保留宇宙泡沫层.<h6>",
			onEnter(){
				player.cb.points = new Decimal(0)
				player.cb.upgrades = []
				player.b.points = new Decimal(0)
				player.b.energy = new Decimal(0)
			},
			onExit(){
				player.cb.points = new Decimal(0)
				player.cb.upgrades = []
				player.b.points = new Decimal(0)
				player.b.energy = new Decimal(0)
			},
			effect(){
				return 1
			},
		},
	},
	clickables:{
		11:{
			title: "获取宇宙泡沫",
			display() {return "重置非特殊宇宙升级并获得宇宙泡沫"},
			canClick(){return true},
			unlocked(){return inChallenge("cb",11)},
			onClick(){
				player.cb.points = player.cb.points.add(player.cb.pointsget.pow(0.25).div(player.cb.points.add(1)).pow(upgradeEffect("cb",64))).mul(upgradeEffect("cb",75))
				player.cb.upgrades = keeper(player.cb.upgrades,[61,62,63,64,65,71,72,73,74,75])
				return
			},
		},
		12:{
			title: "获取增强器",
			display() {return "重置所有泡沫升级和泡沫点数并获得增强器<br>(tip:夸克购买III的第一个效果可以提高获取量)"},
			canClick(){return true},
			unlocked(){return hasUpgrade("cb",65)},
			onClick(){
				player.b.points = player.b.points.add(Decimal.max(player.cb.points.pow(upgradeEffect("cb",72)).pow(upgradeEffect("cb",72)).sub(1).mul(buyableEffect("qu",13))))
				player.cb.points = new Decimal(0)
				if(!hasUpgrade("cb",71)){player.cb.upgrades = []}
				if(hasUpgrade("cb",71)){player.cb.upgrades = keeper(player.cb.upgrades,[71,72,73,74,75])}
				return
			},
			style() {return {'border-color': "#4BDC59" }},
		},
		13:{
			title: "泡沫膨胀",
			display() {return "获得100%宇宙泡沫"},
			canClick(){return true},
			unlocked(){return hasChallenge("cb",11)},
			onClick(){
				player.cb.points = player.cb.points.add(player.cb.pointsparticularly.add(player.cb.pointsget).mul(100))
				return
			},
			style() {return {'border-color': "#3f48cc" }},
		},
	},
	tabFormat: [
		"main-display",
		"blank",
		['display-text',function(){return hasUpgrade("s",13) && !inChallenge("cb",11) ? `<h3>你每秒总共获得 `+format(player.cb.pointsparticularly.add(player.cb.pointsget))+` 宇宙泡沫</h3>` : ``}],
		['display-text',function(){return !inChallenge("cb",11) ? `<h3>你每秒获得 `+format(player.cb.pointsget)+` 宇宙泡沫</h3>` : `<h3>你可以获得 `+format(player.cb.pointsget.pow(0.25).div(player.cb.points.add(1)).pow(upgradeEffect("cb",64)))+` 宇宙泡沫</h3>`}],
		['display-text',function(){return hasUpgrade("s",13) && !inChallenge("cb",11) ? `<h3>你每秒格外获得 `+format(player.cb.pointsparticularly)+` 宇宙泡沫</h3>` : ``}],
		['display-text',function(){return hasChallenge("cb",11) ? `<h3>你的泡沫获取增强 `+format(player.cb.pointsbooster)+` 倍</h3>` : ``}],
		"blank",
		['display-text',function(){return hasUpgrade("cb",65) && inChallenge("cb",11) ? `<h3>你可以获得 `+format(Decimal.max(player.cb.points.pow(upgradeEffect("cb",72)).pow(upgradeEffect("cb",72)).sub(1).mul(buyableEffect("qu",13))),5)+` 增强器</h3>` : ``}],
		"blank",
		['display-text',function(){return player.cb.points.gte(player.cb.pointscap) ? `过多的宇宙泡沫开始使宇宙变得肿胀,宇宙泡沫正在消逝.超过 `+format(player.cb.pointscap)+` 的宇宙泡沫每秒丢失69%</h3>` : ``}],
		"blank",
		"clickables",
		"blank",
		"upgrades",
		"blank",
		"blank",
		"blank",
		"challenges",
		],
})

addLayer("b", {
    name: "booster",
    symbol: "B",
    position: 0,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
		pointsadd: new Decimal(0),
		energy: new Decimal(0),
		energyget: new Decimal(0),
		booster: new Decimal(0),
		booster2: new Decimal(0),
    }},
    color: "#4BDC59",
    requires:function(){
		let req = new Decimal(100).div(buyableEffect("qu", 13))
		return req
	},
    resource: "增强器",
    baseResource: "宇宙泡沫",
    baseAmount() {return player.cb.points},
    type: "static",
	canBuyMax:function(){return hasUpgrade("s",15) ? true:false},
	branches: [["cb","#4bcdbe"]],
    exponent:function(){
		let exp = new Decimal(1)
		if(hasUpgrade("cb",24)){exp = exp.div(upgradeEffect("cb",24))}
		return exp
	},
	base:100,
    gainMult() {
        mult = new Decimal(1)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 1,
    layerShown(){return getBuyableAmount("qu",11).gte(2)},
	update(diff){
		player.b.pointsadd = new Decimal(1).add(player.b.points).add(player.b.booster).add(player.b.booster2).pow(Decimal.add(3).add(upgradeEffect("b",13)))
		player.b.booster = new Decimal(0).max(player.b.energy.pow(0.5).pow(0.65).sub(1),0).min(Decimal.add(30).add(player.b.energy.log(2)))
		if(hasUpgrade("s",14)){player.b.booster2 = new Decimal(player.b.booster).div(10)}
		player.b.energyget = new Decimal(getBuyableAmount("qu", 13)).pow(Decimal.add(1.25).add(getBuyableAmount("qu", 13).mul(0.05))).mul(upgradeEffect("b",14)).mul(upgradeEffect("b",22)).mul(upgradeEffect("s",22))
		if(hasUpgrade("b",12)){player.b.energy = player.b.energy.add(Decimal.add(player.b.energyget).mul(diff))}
	},
	upgrades:{
		11:{
			title: "夸优先克",
			description: "解锁夸克购买III<br>",
			cost: new Decimal(2),
		},
		12:{
			title: "不再废物,或者本不废物?",
			description: "GP?<br>夸克购买III可以生产增强能量<br>",
			cost: new Decimal(3),
			unlocked(){return hasUpgrade("b",11)},
		},
		13:{
			title: "增强增强器",
			description: "每个增强器把增强器效果指数+0.05<br>",
			cost: new Decimal(5),
			effect(){
				let eff = new Decimal(0)
				if(hasUpgrade("b",13)){eff = eff.add(Decimal.min(player.b.points.mul(0.05),1))}
				return eff
			},
			effectDisplay() { return "+"+format(upgradeEffect(this.layer, this.id),2)+"增强指数" },
			unlocked(){return hasUpgrade("b",12)},
		},
		14:{
			title: "增强增强能量",
			description: "增强器加成增强能量获取,但是效果为原加成的0.0085%<br>",
			cost: new Decimal(7),
			effect(){
				let eff = new Decimal(1)
				if(hasUpgrade("b",14)){eff = eff.add(player.b.pointsadd.mul(0.0000085).add(1))}
				return eff
			},
			unlocked(){return hasUpgrade("b",14) || player.b.points.gte(7)},
		},
		15:{
			title: "多重夸克",
			description: "谁说一个层只能有一种获得夸克的方式?<br>解锁格外的增强器夸克获得方式",
			cost: new Decimal(15),
			unlocked(){return hasUpgrade("b",15) || player.b.points.gte(12)},
		},
		21:{
			title: "双向碎片",
			description(){	
				let start = "增强能量降低碎片需求<br>"
				let effect = upgradeEffect(this.layer, this.id).gte(5) && upgradeEffect(this.layer, this.id).lt(10) ? "(软上限)<br>" : ""
				let effect2 = upgradeEffect(this.layer, this.id).gte(10) && upgradeEffect(this.layer, this.id).lt(15) ? "(双重软上限)<br>" : ""
				let effect3 = upgradeEffect(this.layer, this.id).gte(15) ? "(三重软上限)<br>" : ""
				return start + effect + effect2 + effect3
			},
			cost: new Decimal(10000),
			effect(){
				let eff = new Decimal(player.b.energy).add(1).log(13).div(13).add(1)
				eff = softcap(eff,new Decimal(5),0.1)
				eff = softcap(eff,new Decimal(10),0.01)
				eff = softcap(eff,new Decimal(15),0.001)
				return eff
			},
			effectDisplay() { return "/"+format(upgradeEffect(this.layer, this.id),5)+"碎片需求指数" },
			unlocked(){return hasUpgrade("s",12)},
			currencyDisplayName:"增强能量",
			currencyInternalName: "energy",
			currencyLayer: "b",
		},
		22:{
			title: "增量?",
			description: "增(强能)量<br>增强能量获取77倍",
			cost: new Decimal(23333),
			effect(){
				let eff = new Decimal(1)
				if(hasUpgrade("b",22)){eff = new Decimal(77)}
				return eff
			},
			unlocked(){return hasUpgrade("s",12)},
			currencyDisplayName:"增强能量",
			currencyInternalName: "energy",
			currencyLayer: "b",
		},
	},
	tabFormat: [
		"main-display",
		"prestige-button",
		"blank",
		['display-text',function(){
			let effect = `<h3>增强器为你的宇宙泡沫提供 `+format(player.b.pointsadd,3)+` 的加成`
			let effect2 = hasUpgrade("b",14) ? `,为你的增强能量获取提供 `+format(player.b.pointsadd.mul(0.0000085),5)+` 的获取加成</h3>` : ""
			return effect + effect2
		}],
		['display-text',function(){return player.b.energy.gt(0) ? `<h3>你有 `+format(player.b.energy)+` 增强能量,它们给你 `+format(player.b.booster,3)+` 个格外的增强器(不可提升关于增强器的升级)(最多`+format(Decimal.add(30).add(player.b.energy.log(2)))+`个)</h3>` : ``}],
		['display-text',function(){return hasUpgrade("s",14) ? `<h3>你所拥有的 `+format(player.b.booster,3)+` 个格外增强器给了你 `+format(player.b.booster2,3)+` 个被动增强器(不可提升关于增强器的升级)</h3>` : ``}],
		['display-text',function(){return hasUpgrade("b",14) ? `<h3>你每秒获得 `+format(player.b.energyget)+` 增强能量</h3>` : ``}],
		['display-text',function(){return hasUpgrade("s",14) ? `<h3>你总共拥有 `+format(player.b.points.add(player.b.booster).add(player.b.booster),3)+` 个增强器</h3>` : ``}],
		"blank",
		"blank",
		"blank",
		"upgrades",
		"blank",
		"blank",
		"blank",
		"blank",
	]
})

addLayer("s", {
    name: "shatter",
    symbol: "S",
    position: 1,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
		shatter: new Decimal(0),
		energyshatter: new Decimal(0),
		haveupgrades: new Decimal(0)
    }},
    color: "#f2f2f2",
    requires:function(){
		let req = new Decimal(200)
		return req
	},
    resource: "碎片",
    baseResource: "增强能量",
    baseAmount() {return player.b.energy},
    type: "static",
	canBuyMax:function(){return hasUpgrade("s",15) ? true:false},
	branches: [["cb","#97c9df"],["b","#90e498"]],
    exponent:function(){
		let exp = new Decimal(1.35)
		if(hasUpgrade("cb",22)){exp = exp.div(upgradeEffect("cb",22))}
		if(hasUpgrade("b",21)){exp = exp.div(upgradeEffect("b",21))}
		return exp
	},
	base:67,
    gainMult() {
        mult = new Decimal(1)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 1,
    layerShown(){return getBuyableAmount("qu",11).gte(3)},
	update(diff){
	},
	buyables: {
		showRespec: true,
        respec() {
			player.s.energyshatter = new Decimal(player.s.shatter)
			player.s.haveupgrades = new Decimal(0)
			player.s.upgrades = []
			player.b.booster2 = new Decimal(0)
			player.cb.points = new Decimal(0)
			player.cb.upgrades = []
			player.b.upgrades = keeper(player.b.upgrades,[11,12,13,14,15])
		},
		respecText: "重置能量碎片升级",
		11: {
			cost(x) { 
				return new Decimal(x).add(1).pow(2).sub(x)
			},
			title:"碎片能量提升",
			display() { return "把能量注入到你的碎片中<br>提升你的能量阶级并且获得能量碎片<br><br>"+"需要:"+format(this.cost(),0)+"碎片<br>当前阶级:"+format(getBuyableAmount(this.layer, this.id),0)+" 阶<br>总获得能量碎片:"+format(player.s.shatter,0)+"个"},
			canAfford() { return player[this.layer].points.gte(this.cost()) },
			buy() {
				player[this.layer].points = player[this.layer].points.sub(this.cost())
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
				player.s.shatter = player.s.shatter.add(getBuyableAmount(this.layer, this.id)).add(1)
				player.s.energyshatter = player.s.energyshatter.add(getBuyableAmount(this.layer, this.id)).add(1)
			},
			unlocked(){return true},
		},
	},
	upgrades:{
		11:{
			title: "泡沫升级(1 阶)",
			description: "解锁三个泡沫升级<br>当你重置能量碎片升级时解锁的升级会强制取消购买",
			cost:function(){
				let cost = new Decimal(2)
				if(hasUpgrade("s",21)){cost = cost.sub(1)}
				cost = cost.sub(getBuyableAmount("qu",21))
				return cost
			},
			unlocked(){return getBuyableAmount("s",11).gte(1)},
			onPurchase(){
				player.s.haveupgrades = player.s.haveupgrades.add(1)
			},
			currencyDisplayName:"碎片能量",
			currencyInternalName: "energyshatter",
			currencyLayer: "s",
		},
		12:{
			title: "增强器升级(1 阶)",
			description: "解锁二个增强器升级<br>当你重置能量碎片升级时解锁的升级会强制取消购买",
			cost:function(){
				let cost = new Decimal(2)
				if(hasUpgrade("s",21)){cost = cost.sub(1)}
				cost = cost.sub(getBuyableAmount("qu",21))
				return cost
			},
			unlocked(){return getBuyableAmount("s",11).gte(1)},
			onPurchase(){
				player.s.haveupgrades = player.s.haveupgrades.add(1)
			},
			currencyDisplayName:"碎片能量",
			currencyInternalName: "energyshatter",
			currencyLayer: "s",
		},
		13:{
			title: "格外泡沫(2 阶)",
			description: "这有什么用?<br>每秒格外获得10%的宇宙泡沫<br>但是这真的没用吗?",
			cost:function(){
				let cost = new Decimal(2)
				if(hasUpgrade("s",21)){cost = cost.sub(1)}
				cost = cost.sub(getBuyableAmount("qu",21))
				return cost
			},
			unlocked(){return getBuyableAmount("s",11).gte(2)},
			onPurchase(){
				player.s.haveupgrades = player.s.haveupgrades.add(1)
			},
			currencyDisplayName:"碎片能量",
			currencyInternalName: "energyshatter",
			currencyLayer: "s",
		},
		14:{
			title: "格外格外(2 阶)",
			description: "每10个格外增强器可以获得一个被动增强器<br>每一个被动增强器增加一个增强器(重置碎片升级时会重置被动增强器)",
			cost:function(){
				let cost = new Decimal(3)
				if(hasUpgrade("s",21)){cost = cost.sub(1)}
				cost = cost.sub(getBuyableAmount("qu",21))
				return cost
			},
			unlocked(){return getBuyableAmount("s",11).gte(2)},
			onPurchase(){
				player.s.haveupgrades = player.s.haveupgrades.add(1)
			},
			currencyDisplayName:"碎片能量",
			currencyInternalName: "energyshatter",
			currencyLayer: "s",
		},
		15:{
			title: "重复购买(2 阶)",
			description: "你可以购买最大碎片和增强器",
			cost:function(){
				let cost = new Decimal(1)
				if(hasUpgrade("s",21)){cost = cost.sub(1)}
				cost = cost.sub(getBuyableAmount("qu",21))
				return cost
			},
			unlocked(){return getBuyableAmount("s",11).gte(2)},
			onPurchase(){
				player.s.haveupgrades = player.s.haveupgrades.add(1)
			},
			currencyDisplayName:"碎片能量",
			currencyInternalName: "energyshatter",
			currencyLayer: "s",
		},
		21:{
			title: "这下你满意了吧?(3 阶)",
			description: "所有碎片升级消耗-1",
			cost:function(){
				let cost = new Decimal(8)
				if(hasUpgrade("s",21)){cost = cost.sub(1)}
				cost = cost.sub(getBuyableAmount("qu",21))
				return cost
			},
			unlocked(){return getBuyableAmount("s",11).gte(3)},
			onPurchase(){
				player.s.haveupgrades = player.s.haveupgrades.add(1)
			},
			currencyDisplayName:"碎片能量",
			currencyInternalName: "energyshatter",
			currencyLayer: "s",
		},
		22:{
			title: "碎片也想要加成!(3 阶)",
			description: "使增强能量获取乘碎片",
			cost:function(){
				let cost = new Decimal(3)
				if(hasUpgrade("s",21)){cost = cost.sub(1)}
				cost = cost.sub(getBuyableAmount("qu",21))
				return cost
			},
			effect(){
				let eff = new Decimal(0)
				if(hasUpgrade("s",22)){eff = new Decimal(player.s.points).add(1)}
				return eff
			},
			effectDisplay() { return "*"+format(player.s.points.add(1),0)+"能量获取" },
			unlocked(){return getBuyableAmount("s",11).gte(3)},
			onPurchase(){
				player.s.haveupgrades = player.s.haveupgrades.add(1)
			},
			currencyDisplayName:"碎片能量",
			currencyInternalName: "energyshatter",
			currencyLayer: "s",
		},
		23:{
			title: "一次性升级(3 阶)",
			description: "解锁夸克购买IV",
			cost:function(){
				let cost = new Decimal(10)
				if(hasUpgrade("s",21)){cost = cost.sub(1)}
				cost = cost.sub(getBuyableAmount("qu",21))
				return cost
			},
			unlocked(){return getBuyableAmount("s",11).gte(3)},
			onPurchase(){
				player.s.haveupgrades = player.s.haveupgrades.add(1)
			},
			currencyDisplayName:"碎片能量",
			currencyInternalName: "energyshatter",
			currencyLayer: "s",
		},
		24:{
			title: "昂贵不是没有道理的(4 阶)",
			description: "宇宙泡沫获取^1.5",
			cost:function(){
				let cost = new Decimal(13)
				if(hasUpgrade("s",21)){cost = cost.sub(1)}
				cost = cost.sub(getBuyableAmount("qu",21))
				return cost
			},
			unlocked(){return getBuyableAmount("s",11).gte(4)},
			onPurchase(){
				player.s.haveupgrades = player.s.haveupgrades.add(1)
			},
			currencyDisplayName:"碎片能量",
			currencyInternalName: "energyshatter",
			currencyLayer: "s",
		},
	},
	tabFormat: [
		"main-display",
		"prestige-button",
		"blank",
		['display-text',function(){return `<h3>你有 `+format(player.s.energyshatter,0)+` / `+format(player.s.shatter,0)+` 碎片能量</h3>`}],
		"blank",
		['display-text',function(){return `<h3>你有 `+format(player.s.haveupgrades,0)+` 碎片升级</h3>`}],
		"blank",
		"buyables",
		"blank",
		"upgrades",
		"blank",
		"blank",
	]
})

addLayer("c", {
    name: "Completeness",
    symbol: "C",
    position: 0,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#c3c3c3",
    requires:function (){
		let req = new Decimal(4);
		return req
	},
    resource: "完整性",
    baseResource: "碎片阶段", 
    baseAmount() {return getBuyableAmount("s",11)},
    type: "normal",
	branches: [["s","#dfdfdf"]],
    exponent: 1,
    gainMult() {
        let mult = new Decimal(1)
        return mult
    },
    gainExp() { 
		let exp = new Decimal(1)
        return exp
    },
    row: 3, 
    layerShown(){return getBuyableAmount("qu",11).gte(4)},
})