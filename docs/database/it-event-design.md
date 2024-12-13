# IT事件管理系统数据库设计文档

## 一、设计目标

设计一个支持IT运维管理系统中事件管理功能的数据库结构,实现:
1. 事件全生命周期管理
2. 处理过程跟踪记录
3. 文件附件管理 
4. 事件升级与协作
5. 统计分析支持 

## 二、数据表设计

### 1. 事件主表 (it_event)

用于存储事件的基本信息:

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| event_id | varchar(32) | 是 | 事件编号(如:EV2024030001),主键 |
| title | varchar(200) | 是 | 事件标题 |
| description | text | 是 | 事件描述 |
| type_id | varchar(32) | 是 | 事件类型ID |
| priority_id | varchar(32) | 是 | 优先级ID |
| status_id | varchar(32) | 是 | 状态ID |
| impact_level | varchar(20) | 是 | 影响范围(个人/部门/全校) |
| creator | varchar(50) | 是 | 创建人 |
| creator_role | varchar(50) | 是 | 创建人角色(教师/学生/职工) |
| creator_college | varchar(100) | 是 | 创建人所属学院 |
| creator_dept | varchar(100) | 否 | 创建人所属系/部门 |
| handler | varchar(50) | 否 | 当前处理人 |
| handler_type | varchar(20) | 否 | 处理人类型(普通处理人/高级处理人) |
| create_time | datetime | 是 | 创建时间 |
| update_time | datetime | 是 | 最后更新时间 |
| finish_time | datetime | 否 | 完成时间 |
| expected_finish_time | datetime | 否 | 预计完成时间 |
| is_escalated | tinyint(1) | 是 | 是否已升级(0:否 1:是) |

### 2. 事件处理记录表 (it_event_record)

用于记录事件处理过程:

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| record_id | varchar(32) | 是 | 记录ID,主键 |
| event_id | varchar(32) | 是 | 关联事件ID |
| operator | varchar(50) | 是 | 操作人 |
| operator_role | varchar(20) | 是 | 操作人角色(处理人/协作人/系统) |
| action | varchar(50) | 是 | 操作类型(提交/分派/开始处理/处理中/转交处理/处理完成/升级/协作/关闭) |
| content | text | 是 | 处理内容 |
| record_time | datetime | 是 | 记录时间 |
| record_type | varchar(20) | 是 | 记录类型(info/warning/primary/danger/success) |
| attachments | json | 否 | 关联附件ID列表 |

### 3. 事件附件表 (it_event_attachment)

用于存储事件相关附件:

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| attachment_id | varchar(32) | 是 | 附件ID,主键 |
| event_id | varchar(32) | 是 | 关联事件ID |
| record_id | varchar(32) | 否 | 关联处理记录ID |
| file_name | varchar(200) | 是 | 文件名称 |
| file_path | varchar(500) | 是 | 文件路径 |
| file_size | bigint | 是 | 文件大小(字节) |
| file_type | varchar(50) | 是 | 文件类型 |
| upload_time | datetime | 是 | 上传时间 |
| uploader | varchar(50) | 是 | 上传人 |

### 4. 事件升级记录表 (it_event_escalation)

用于记录事件升级信息:

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| escalation_id | varchar(32) | 是 | 升级记录ID,主键 |
| event_id | varchar(32) | 是 | 关联事件ID |
| from_handler | varchar(50) | 是 | 原处理人 |
| to_handler | varchar(50) | 是 | 升级处理人(高级处理人) |
| reason | text | 是 | 升级原因 |
| escalation_time | datetime | 是 | 升级时间 |
| status | varchar(20) | 是 | 升级状态(待接收/已接收/已拒绝/已完成) |
| complete_time | datetime | 否 | 完成时间 |
| response_content | text | 否 | 响应内容 |

### 5. 事件协作表 (it_event_collaboration)

用于记录事件协作处理信息:

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| collaboration_id | varchar(32) | 是 | 协作ID,主键 |
| event_id | varchar(32) | 是 | 关联事件ID |
| collaborator | varchar(50) | 是 | 协作人 |
| collaborator_role | varchar(20) | 是 | 协作人角色 |
| inviter | varchar(50) | 是 | 邀请人 |
| invite_time | datetime | 是 | 邀请时间 |
| status | varchar(20) | 是 | 协作状态(待接受/进行中/已完成/已拒绝) |
| complete_time | datetime | 否 | 完成时间 |
| response_content | text | 否 | 响应内容 |

### 6. 事件分派规则表 (it_event_dispatch_rule)

用于配置事件自动分派规则:

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| rule_id | varchar(32) | 是 | 规则ID,主键 |
| rule_name | varchar(100) | 是 | 规则名称 |
| event_type | varchar(50) | 是 | 事件类型 |
| priority | varchar(20) | 是 | 优先级 |
| target_handler | varchar(50) | 是 | 目标处理人 |
| description | text | 否 | 规则描述 |
| status | varchar(20) | 是 | 规则状态(启用/禁用) |
| create_time | datetime | 是 | 创建时间 |
| update_time | datetime | 是 | 更新时间 |

### 7. 事件处理人表 (it_event_handler)

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| handler_id | varchar(32) | 是 | 处理人ID,主键 |
| handler_name | varchar(50) | 是 | 处理人姓名 |
| handler_type | varchar(20) | 是 | 处理人类型(普通处理人/高级处理人) |
| handler_role | varchar(20) | 是 | 角色(如:工程师/主管/经理/总监) |
| handler_dept | varchar(100) | 是 | 所属部门 |
| status | varchar(20) | 是 | 状态(在岗/离岗/休假) |
| create_time | datetime | 是 | 创建时间 |
| update_time | datetime | 是 | 更新时间 |

### 8. 事件类型表 (it_event_type)

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| type_id | varchar(32) | 是 | 类型ID,主键 |
| type_code | varchar(50) | 是 | 类型编码 |
| type_name | varchar(100) | 是 | 类型名称 |
| description | text | 否 | 类型描述 |
| sort_order | int | 是 | 排序号 |
| status | tinyint(1) | 是 | 状态(0:禁用 1:启用) |
| create_time | datetime | 是 | 创建时间 |
| update_time | datetime | 是 | 更新时间 |

### 9. 事件优先级表 (it_event_priority)

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| priority_id | varchar(32) | 是 | 优先级ID,主键 |
| priority_code | varchar(50) | 是 | 优先级编码 |
| priority_name | varchar(100) | 是 | 优先级名称 |
| description | text | 否 | 优先级描述 |
| sla_time | int | 是 | SLA响应时间(小时) |
| sort_order | int | 是 | 排序号 |
| status | tinyint(1) | 是 | 状态(0:禁用 1:启用) |
| create_time | datetime | 是 | 创建时间 |
| update_time | datetime | 是 | 更新时间 |

### 10. 事件状态表 (it_event_status)

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| status_id | varchar(32) | 是 | 状态ID,主键 |
| status_code | varchar(50) | 是 | 状态编码 |
| status_name | varchar(100) | 是 | 状态名称 |
| description | text | 否 | 状态描述 |
| sort_order | int | 是 | 排序号 |
| is_final | tinyint(1) | 是 | 是否终态(0:否 1:是) |
| status | tinyint(1) | 是 | 状态(0:禁用 1:启用) |
| create_time | datetime | 是 | 创建时间 |
| update_time | datetime | 是 | 更新时间 |

## 三、索引设计

1. it_event表:
   - 主键索引: event_id
   - 普通索引: status, handler, creator, create_time, creator_college

2. it_event_record表:
   - 主键索引: record_id
   - 普通索引: event_id, operator, record_time

3. it_event_attachment表:
   - 主键索引: attachment_id
   - 普通索引: event_id, record_id

4. it_event_escalation表:
   - 主键索引: escalation_id
   - 普通索引: event_id, to_handler

5. it_event_collaboration表:
   - 主键索引: collaboration_id
   - 普通索引: event_id, collaborator

6. it_event_dispatch_rule表:
   - 主键索引: rule_id
   - 普通索引: event_type, priority, status

7. it_event_handler表:
   - 主键索引: handler_id
   - 普通索引: handler_type, status

8. it_event_type表:
   - 主键索引: type_id
   - 唯一索引: type_code
   - 普通索引: status, sort_order

9. it_event_priority表:
   - 主键索引: priority_id
   - 唯一索引: priority_code
   - 普通索引: status, sort_order

10. it_event_status表:
    - 主键索引: status_id
    - 唯一索引: status_code
    - 普通索引: status, sort_order, is_final

## 四、关联关系

1. it_event_record.event_id -> it_event.event_id
2. it_event_attachment.event_id -> it_event.event_id
3. it_event_attachment.record_id -> it_event_record.record_id
4. it_event_escalation.event_id -> it_event.event_id
5. it_event_collaboration.event_id -> it_event.event_id
6. it_event.handler -> it_event_handler.handler_id
7. it_event.type_id -> it_event_type.type_id
8. it_event.priority_id -> it_event_priority.priority_id
9. it_event.status_id -> it_event_status.status_id

</rewritten_file>