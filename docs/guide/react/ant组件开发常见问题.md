# ant组件开发常见问题



## table组件设置 sticky 滚动条没有固定在容器底部



父组件重要class，如果没有滚动条固定容器底部肯定是父组件没有设置这些

```css
flex flex-row overflow-y-auto
```



事例：

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

