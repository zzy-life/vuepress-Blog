# ant组件开发常见问题



## table组件设置 sticky 滚动条没有固定在容器底部



父组件重要class，如果没有滚动条固定容器底部肯定是父组件没有设置这些

```css
flex flex-row overflow-y-auto
```



示例：

```react
<div className='flex flex-row overflow-y-auto rounded-md bg-white' style={{ height: `${window.innerHeight - 100}px` }}>
                <div className="flex flex-row overflow-y-auto rounded-md bg-white">
                    <div className="flex-1">
                        {/* 表单部分 */}
                        <div ref={ref}>
                            <ProTable
                                columns={columns}
                                dataSource={data}
                                loading={loading}
                                formRef={tableRef}
                                sticky={{ offsetHeader: 64 }}
                                scroll={{ x: 1320, y: tableBodyHeight }}
                            />
                        </div>
                    </div>
                </div>
</div>
```





## table组件设置了sticky但是summary没有固定在底部



summary必须要采用summary={(pageData) => ()形式，不能使用：summary={(pageData) => {return ()}




正确示例：

```javascript
summary={(pageData) => (
                        <ProTable.Summary fixed>
                            <ProTable.Summary.Row>
                                <ProTable.Summary.Cell index={0} colSpan={10}>本页汇总</ProTable.Summary.Cell>
                                {(() => {
                                    let totalMoney = new Decimal(0);
                                    let totalAllotMoney = new Decimal(0);

                                    // Process pageData to calculate totals
                                    pageData.forEach((item) => {
                                        let money = new Decimal(item.money ?? 0);
                                        if (item.typeId != 1) {
                                            money = money.negated();
                                        }
                                        totalMoney = totalMoney.plus(money);
                                        totalAllotMoney = totalAllotMoney.plus(new Decimal(item.allotMoney ?? 0));
                                    });

                                    // Format and prepare totals for rendering
                                    const totals = [
                                        totalMoney.toFixed(2),
                                        totalAllotMoney.toFixed(2)
                                    ];

                                    return totals.map((total, index) => (
                                        <ProTable.Summary.Cell
                                            key={index}
                                            index={10 + index}
                                            colSpan={1}
                                            className={new Decimal(total).lessThanOrEqualTo(0) ? "text-blue-500" : "text-red-500"}
                                        >
                                            {renderPrice({ value: total, suffix: "元" })}
                                        </ProTable.Summary.Cell>
                                    ));
                                })()}
                            </ProTable.Summary.Row>
                        </ProTable.Summary>
                    )}
```


