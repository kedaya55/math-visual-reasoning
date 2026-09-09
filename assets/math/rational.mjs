// Exact school-level rational arithmetic. Public values remain JSON-serializable.
function gcd(a,b){a=a<0n?-a:a;while(b){[a,b]=[b,a%b]}return a;}
function reduced(n,d){if(d===0n)throw new RangeError('Zero denominator');if(d<0n){n=-n;d=-d}const g=gcd(n,d);n/=g;d/=g;const limit=BigInt(Number.MAX_SAFE_INTEGER);if(n>limit||n< -limit||d>limit)throw new RangeError('Rational exceeds safe integer range');return{n:Number(n),d:Number(d)};}
export function rational(value=0){
 if(typeof value==='number'){if(!Number.isSafeInteger(value))throw new RangeError('Use a decimal string for noninteger input');return{n:value,d:1}}
 if(typeof value==='string'){if(!/^[+-]?\d+(?:\.\d+)?$/.test(value)||value.length>30)throw new RangeError('Decimal string required');const [a,b='']=value.replace(/^[+-]/,'').split('.');return reduced(BigInt(a+b)*(value.startsWith('-')?-1n:1n),10n**BigInt(b.length));}
 if(!value||!Number.isSafeInteger(value.n)||!Number.isSafeInteger(value.d))throw new RangeError('Safe integer numerator and denominator required');return reduced(BigInt(value.n),BigInt(value.d));
}
export function rationalOp(a,op,b){a=rational(a);b=rational(b);const n=BigInt(a.n),d=BigInt(a.d),p=BigInt(b.n),q=BigInt(b.d);if(op==='+')return reduced(n*q+p*d,d*q);if(op==='-')return reduced(n*q-p*d,d*q);if(op==='*')return reduced(n*p,d*q);if(op==='/')return reduced(n*q,d*p);throw new RangeError('Unknown rational operation');}
export function rationalText(a){a=rational(a);return a.d===1?String(a.n):`${a.n}/${a.d}`;}
export function rationalNumber(a){a=rational(a);return a.n/a.d;}
export function integerGcd(a,b){if(![a,b].every(Number.isSafeInteger)||a<0||b<0)throw new RangeError('Nonnegative safe integers required');return Number(gcd(BigInt(a),BigInt(b)));}
export function integerLcm(a,b){if(a===0||b===0){integerGcd(a,b);return 0}const value=BigInt(a/integerGcd(a,b))*BigInt(b);if(value>BigInt(Number.MAX_SAFE_INTEGER))throw new RangeError('LCM exceeds safe range');return Number(value);}
