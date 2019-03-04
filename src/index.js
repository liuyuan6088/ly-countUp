import React from 'react';

import "./index.scss";

const PERCENT = '%';
const MONEY = '元';
const format = num => String(num).split('').filter(e => /^[0-9]*$/.test(String(e)));
const spanNode = Array.from({ length: 10 }, (_, k) => k).map(e => <span key={e}>{e}</span>);
const keeyDecimal = (num, n = 2) => {
  let res = parseFloat(num);
  if (!res) return 0;
  res = Math.round(num * 10**n) / 10**n;
  let x = res.toString();
  let pos = x.indexOf('.');
  if (pos < 0) {
    pos = x.length;
    x += '.';
  }
  while (x.length <= pos + n) {
    x += '0';
  }
  return x;
}
const toMoney = num => {
  const numArr = String(num).split('');
  const pos = numArr.findIndex(v => v === '.');
  const after = pos >= 0 ? numArr.slice(pos, numArr.length) : [];
  const arr = pos >= 0 ? numArr.slice(0, pos) : numArr;
  let res = [];
  let count = 0;
  for (let i = arr.length - 1; i >= 0; i--) {
    count ++;
    res.unshift(arr[i]);
    if (count % 3 === 0 && i !== 0) res.unshift(',');
  }
  return res.concat(after).join('');
}
const fn = (num, type = 'num') => {
  if (type === 'percent') return +keeyDecimal(num);
  if (type === 'money') return toMoney(keeyDecimal(num));
  return num;
}

export default class CountUp extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      start: fn(props.start, props.type) || 0,
    };
    this.animation = this.animation.bind(this);
    this.renderLi = this.renderLi.bind(this);
  }

  componentDidMount(){
    this.animation();
  }

  static getDerivedStateFromProps(nextProps, preState) {
    if (nextProps.start !== preState.start) {
      return {
        start: fn(nextProps.start, nextProps.type),
      }
    }
    return null;
  }

  componentDidUpdate() {
    this.animation();
  }

  animation() {
    const { start } = this.state;
    const height = this.countUp.offsetHeight;
    const liNode = this.countUp.getElementsByClassName('num-li');
    Array.from(liNode).forEach((e,i) => {
      let timer = null;
      e.dataset.value = format(start)[i];
      // e.style.top = `-${format(start)[i]*height}px`;
      cancelAnimationFrame(timer);
      const end = -format(start)[i]*height;
      const fn = () => {
        const current = parseFloat(e.style.top);
        let step = (end - current) / 15;
        step = step > 0 ? Math.ceil(step) : Math.floor(step);
        if (Math.abs(step) >= Math.abs(current - end)) {
          e.style.top = `${end}px`;
          cancelAnimationFrame(timer);
        } else {
          e.style.top = `${current + step}px`;
          timer = requestAnimationFrame(fn);
        }
      };
      timer = requestAnimationFrame(fn);
    });
  }

  renderLi() {
    const { start } = this.state;
    const { type } = this.props
    if (type === 'percent') {
      return (
        String(start).split('').map((e,i) => {
          if (/^[0-9]*$/.test(String(e))) {
            return (
              <li className='num-li' style={{ top: 0 }} data-value={0} key={`${e}${i}`}>
                { spanNode }
              </li>
            )
          }
          return (
            <li style={{ top: 0 }} data-value={0} key={`${e}${i}`}><span>{e}</span></li>
          )
        }).concat([
          <li style={{ top: 0 }} data-value={0} key={PERCENT}><span>{PERCENT}</span></li>
        ])
      )
    }

    if (type === 'money') {
      return (
        String(start).split('').map((e,i) => {
          if (/^[0-9]*$/.test(String(e))) {
            return (
              <li className='num-li' style={{ top: 0 }} data-value={0} key={`${e}${i}`}>
                { spanNode }
              </li>
            )
          }
          return (
            <li style={{ top: 0 }} data-value={0} key={`${e}${i}`}><span style={{ fontFamily: 'PingFang SC' }}>{e}</span></li>
          )
        }).concat([
          <li style={{ top: 0 }} data-value={0} key={MONEY}><span>{MONEY}</span></li>
        ])
      )
    }

    return format(start).map((e,i) => (
      <li className='num-li' style={{ top: 0 }} data-value={0} key={`${e}${i}`}>
        { spanNode }
      </li>
    ))
  }

  

  render() {
    return (
      <ul ref={e => this.countUp = e} className={'countUp'}>
        { this.renderLi() }
      </ul>
    )
  }
}
