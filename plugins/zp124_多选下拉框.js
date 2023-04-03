import React from "react"
import css from "../css/zp124_多选下拉框.css"

function render(ref) {
    const { input } = ref
    if (!ref.props.dbf) return <div>请配置表单字段</div>
    let values = ref.getForm(ref.props.dbf)
    if (!Array.isArray(values)) {
        if (values) warn("表单字段必须是数组")
        values = []
    }
    return <React.Fragment>
        <div onClick={() => pop(ref)} className="zp124box">
            <ul onClick={e => e.stopPropagation()}>{values.map((a, i) => 
                <li key={i}> <span>{a}</span><span onClick={click(ref, a)}>{svg_x}</span></li>
            )}</ul>
            <input value={ref.input || ""} onKeyDown={e => keyDown(ref, e)} onChange={e => {ref.input = e.target.value; ref.open = true; ref.render()}} autoComplete="off"/>
        </div>
        {ref.open && <ul className="zp124drop">{(input ? ref.options.filter(a => typeof a === "string" ? a.includes(input) : (a + "").includes(input)) : ref.options).map((a, i) => 
            <li onClick={click(ref, a)} className={values.includes(a) ? "selected" : ""} key={i}>{a}{values.includes(a) ? svg_check : ""}</li>
        )}</ul>}
    </React.Fragment>
}

function init(ref) {
    const { exc, props, render } = ref
    ref.options = exc('clone(o)', { o: props.options || ref.children })
    if (!Array.isArray(ref.options)) ref.options = []
    ref.clickOutside = e => {
        if (ref.container.contains(e.target)) return // Do nothing if clicking on container's element or descendent elements
        ref.open = false
        render()
    }
}

function click(ref, v) {
    return e => {
        const { props } = ref
        e.preventDefault()
        ref.input = ""
        ref.open = false
        let values = ref.getForm(props.dbf)
        if (!Array.isArray(values)) values = []
        values.indexOf(v) > -1 ? values.splice(values.indexOf(v), 1) : values.push(v)
        ref.setForm(props.dbf, values)
        if (props.onChange) ref.exc(props.onChange, { ...ref.ctx, $x: v })
    }
}

function keyDown(ref, e) {
    const { props } = ref
    let values = ref.getForm(props.dbf)
    if (!Array.isArray(values)) values = []
    switch (e.which) {
        case 8: // BackSpace
            if (e.target.value) return
            values.pop()
            ref.setForm(props.dbf, values)
            if (props.onChange) ref.exc(props.onChange, { ...ref.ctx, $x: v })
            break
        case 13: // Enter 移动端无回车键
        case 188: // ,    移动端无法触发
            e.preventDefault()
            if (!props.xOption || !e.target.value) return
            ref.input = ""
            values.push(e.target.value)
            ref.setForm(props.dbf, values)
            if (props.onChange) ref.exc(props.onChange, { ...ref.ctx, $x: v })
            break
    }
}

function pop(ref) {
    ref.open = !ref.open
    ref.render()
    setTimeout(() => {
        ref.input = ""
        if (ref.open) {
            ref.container.firstElementChild.children[1].focus()
            document.addEventListener("mousedown", ref.clickOutside)
            document.addEventListener("touchstart", ref.clickOutside)
        } else {
            document.removeEventListener("mousedown", ref.clickOutside)
            document.removeEventListener("touchstart", ref.clickOutside)
        }
    }, 9)
}

function destroy(ref) {
    document.removeEventListener("mousedown", ref.clickOutside)
    document.removeEventListener("touchstart", ref.clickOutside)
}


$plugin({
    id: "zp124",
    props: [{
        prop: "dbf",
        type: "text",
        label: "表单字段"
    }, {
        prop: "options",
        type: "text",
        label: "options选项数组",
        ph: "用括弧包裹表达式，优先于子组件"
    }, {
        prop: "xOption",
        type: "switch",
        label: "允许用户通过回车键或逗号添加选项"
    }, {
        prop: "onChange",
        type: "exp",
        label: "onChange表达式"
    }],
    render,
    init,
    destroy,
    css
})
const svg_x = <svg className="zsvg" viewBox="64 64 896 896"><path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"/></svg>
const svg_check = <svg className="zsvg" viewBox="0 0 1024 1024"><path d="M384 691.2 204.8 512 145.066667 571.733333 384 810.666667 896 298.666667 836.266667 238.933333Z"/></svg>