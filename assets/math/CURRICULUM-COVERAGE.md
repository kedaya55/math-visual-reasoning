# 小学、初中知识点与可复用素材索引

依据教育部《义务教育数学课程标准（2022年版）》的课程内容整理，检索日期 2026-09-08。[官方发布通知](https://www.moe.gov.cn/srcsite/A26/s8001/202204/t20220420_619921.html) · [官方课标 PDF](https://www.moe.gov.cn/srcsite/A26/s8001/202204/W020220510531636118932.pdf)。以下页码为书内印刷页码，PDF 页序比它多 7 页。

按知识群整理，不按某出版社的年级目录；具体初三题目仍需核对学生已学内容。课标中的选学内容及教学拓展不等同于所有学生必学。这里的“新增”表示已有可调用模型和图形，“组合”表示可用组件组织表征，尚无该命题专用证明动画。

[新增 39 类交互示例](expansion-preview.html) · [原有组件](library-preview.html) · [新增接口](EXPANSION-API.md) · [检查与限制](EXPANSION-QA.md)

## 小学

| 知识群 | 可复用组件（文件名省略 .mjs） | 状态与教学边界 |
| --- | --- | --- |
| 分类、数数、一一对应、分组、余数、规律排列 | classification、counting-array | 新增；身份不变，可换分类标准；一般规律仍需论证 |
| 整数、小数、计数单位、数位、十进制、大小比较、近似数 | place-value、number-line、rational | 新增数位交换和精确分数；估算、四舍五入规则用数轴另行组织 |
| 四则、竖式、进退位、运算律、混合运算 | arithmetic-board、counting-array、bar-model、expression-layout | 新增非负整数逐步计算；运算律及小数竖式需组合，未提供通用算式求值器 |
| 因数、倍数、奇偶、质数合数、公因数公倍数 | arithmetic-board、classification | 新增质因数分解、最大公因数和最小公倍数；整除判定规则另证 |
| 分数意义、等值分数、通分、约分、四则 | fraction-grid、fraction-operation、rational | 新增同单位加减、乘法重叠和除法分组；乘法面积示意目前限两个因数在 [0,1] |
| 百分数、比、比例、比例尺、按比分配 | fraction-grid、bar-model、grid-transform、function-graph | 组合；同一整体、同一长度尺度必须明确 |
| 字母表示数、简易方程、等量关系 | equation-model、algebra-tiles、expression-layout | 新增线性等式合法同变；列方程由题意决定 |
| 和差倍比、单价数量总价、速度时间路程、相遇追及 | bar-model、motionTrackModel、equation-model | 新增数量条和匀速位置轨道；单位、正方向及现实条件由题目设定 |
| 长度、面积、体积、容积、质量与单位换算 | measurement、fraction-grid、cube-assembly、solid | 新增同量纲换算；不把长度进率用于面积或体积 |
| 人民币、时分秒、年月日 | measurement、calendar-bearing、bar-model | 新增元角分换算、连续时针、闰年日历；年月不能按固定天数转换 |
| 线段直线射线、角、量角、垂直与平行 | rulerModel、protractorModel、angle、parallel-lines、construction | 新增测量和作图；有限屏幕线段只是无限直线的可见部分 |
| 三角形分类、三边关系、内角和 | polygon、triangle-geometry、angle | 组合；拒绝退化三角形不等于已经演示三角形不等式证明 |
| 长方形、正方形、平行四边形、梯形、多边形周长面积 | labeled-rectangle、polygon、dissection | 新增凸多边形一次直线剪分；目标拼法、无重叠与一般推导由工程验证 |
| 圆的周长面积、半径直径、扇形 | labeled-circle、sector-partition、circle-geometry | 原有圆与扇形加新增弦和角；有限分割是逼近，不能省略极限说明 |
| 轴对称、平移、旋转、位置方向、数对、比例尺 | grid-transform、calendar-bearing、coordinate-plane | 新增任意轴反射和方位；方位角从北顺时针，坐标旋转逆时针为正 |
| 立体辨认、观察物体、长方体正方体、圆柱圆锥 | solid、solid-views、cube-assembly | 新增三视图和有来源的小方块投影；二维投影不代表真实边长 |
| 展开图、表面积、体积、切分与分层 | cuboid-net、cylinder-surface、cone-surface、solid-section、cube-assembly | 新增指定展开、截面和计数；未含所有展开方式及一般灌装证明 |
| 分类统计、平均数、条形折线扇形统计图、百分比 | classification、data-chart、statistics | 新增加权统计；图表数据口径与实际调查需要题目交代 |
| 可能、不可能、可能性大小、简单随机现象 | sample-space、probability-tree、frequencyExperimentModel | 新增结果列表和预录试验回放；必须说明是否等可能 |
| 综合实践、调查、购物、时间规划、测量与设计 | 上述组件按情境组合 | 没有“自动实践项目”组件；真实数据、建模假设与结论有效性需单独验证 |

来源范围：数与代数第 17–26 页，图形与几何第 27–35 页，统计与概率第 36–41 页，综合与实践第 42–52 页。

## 初中

| 知识群 | 可复用组件 | 状态与教学边界 |
| --- | --- | --- |
| 有理数、相反数、绝对值、数轴、四则 | number-line、rational、equation-model | 有符号数与精确有理运算；负数结果不套用无符号面积 |
| 平方根、立方根、实数、近似、科学记数法 | number-line、expression-layout、counting-array | 组合；根式/幂可排版，未提供符号根式化简和任意精度无理数运算 |
| 整式、同类项、乘法公式、因式分解 | algebra-tiles、expression-layout、dissection | 组合；代数块表达系数，恒等式须明确变量条件及代数推广 |
| 分式及运算、分式方程 | expression-layout、equation-model | 部分组合；分母非零条件、去分母及验根由题目明确，未实现分式方程自动求解 |
| 一元一次方程、二元一次方程组 | equation-model、linearSystemModel、function-analysis | 新增线性同变和二元求解模型；消元步骤需工程组织 |
| 一元二次方程、根的情况、配方法 | polynomialRoots、algebra-tiles、expression-layout | 新增一次/二次实根数值求解（含退化）；不自动生成配方法证明 |
| 一元一次不等式、不等式组 | equation-model、interval-set、number-line | 新增负数乘法变号、开闭端点、交并、空集与单点 |
| 变量关系、函数、自变量范围、一次正比例二次反比例 | function-graph、function-analysis、coordinate-plane、bar-model | 新增一次/二次交点；反比例仍使用原组件分段处理渐近线；实际定义域另设 |
| 平行线、垂线、角关系、命题与证明 | parallel-lines、angle、construction | 新增可破坏平行条件的对照；命题真假与逆命题不能用一幅图判定 |
| 尺规基本作图 | construction | 新增中垂线、角平分线、过点垂线、三边作三角形、复制角、过线外点平行线六种；显示作图圆与交点 |
| 三角形中线高线角平分线、等腰等边、内外角 | triangle-geometry、polygon、angle | 新增辅助线、重心垂心内心外心；中心内容可用于拓展，不承诺全为初中必学 |
| 全等及 SSS/SAS/ASA/AAS/HL、边角关系 | polygon、construction、edge-label、angle | 组合；对应点可追踪，但没有全等条件自动判定/证明器 |
| 勾股定理及逆定理、直角三角形 | right-triangle、rightTriangleRatiosModel、dissection | 新增边上正方形与同源三角比；测得等式不能替代一般证明 |
| 多边形内外角、对角线、平行四边形及特殊四边形 | polygon、angle、dissection、grid-transform | 组合；判定定理、对角线和中位线按题目加辅助线 |
| 圆、弧弦、垂径、圆周角、切线、内接正多边形 | circle-geometry、labeled-circle、sector-partition | 新增实际弧与圆心角/圆周角关系、圆外切线；圆心角可为优角 |
| 弧长扇形面积、圆锥侧面积及表面最短路线 | sector-partition、cone-surface | 新增等距展开；默认路线限半底圆两端对应的指定侧面弦，不能泛化到穿底面或跨多次接缝 |
| 轴对称平移旋转、相似、位似、比例线段 | grid-transform、polygon、bar-model | 新增任意反射轴和点像对应；相似判定与面积体积比例仍需论证 |
| 锐角三角函数、解直角三角形、测高测距 | rightTriangleRatiosModel、calendar-bearing | 新增三边角度 sin/cos/tan 同步；测量情境、仰俯角和误差另设 |
| 平面直角坐标、图形坐标变换、函数几何综合 | coordinate-plane、grid-transform、function-analysis | 组合；非线性约束的动点问题需专门数学模型 |
| 投影、视图、棱柱与圆锥展开、空间想象 | solid-views、cube-assembly、cuboid-net、prism-surface、cone-surface | 新增正投影、平行/中心投影和受约束展开；不含任意曲面或所有多面体展开 |
| 数据收集抽样、频数表、频数直方图 | statistics、data-chart | 新增末组右端点归组及不等组距频数密度；样本代表性不能由图形自动保证 |
| 均值加权均值、中位数众数、方差 | statistics | 新增按频数加权；方差分母为 n；多众数保留全部 |
| 四分位数、箱线图 | statistics | 新增两种明确口径；默认上下半组中位数，须对照教材；箱须端点为最小/最大值，不使用异常值围栏 |
| 随机事件、列表/树状列举、概率、用频率估计概率 | sample-space、probability-tree、frequencyExperimentModel | 新增有身份的有序样本空间、权重与预录序列；不把一次试验趋势当作必然收敛 |
| 综合实践、项目学习、数学建模 | 按以上知识与表征组合 | 实际数据、假设、建模及检验仍需逐题完成 |

来源范围：数与代数第 53–61 页，图形与几何第 63–70 页，统计与概率第 74–76 页，综合与实践及相关说明见初中课程内容后续部分。三元方程组等课标选学项目、特殊截面和部分中心模型作为扩展，不能据此推断为某一册必学。

## 调用顺序

1. 先确定题目所属学段、已知条件与要解释的关系，从本表选表征。
2. 查对应接口和参数边界，复制所需模块及其递归依赖，不读取整库。
3. 解题并验证数学关系；为对象和来源分配稳定身份，再设计运动与依据交接。
4. 在真实视频中检查起点、中间、终点、逆向定位、遮挡和文字。组件通过检查不等于该视频已经通过验收。
