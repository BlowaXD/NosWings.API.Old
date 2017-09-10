/*
Navicat SQL Server Data Transfer

Source Server         : NosWings V4
Source Server Version : 130000
Source Host           : 164.132.206.181:1433
Source Database       : opennos
Source Schema         : dbo

Target Server Type    : SQL Server
Target Server Version : 130000
File Encoding         : 65001

Date: 2017-09-10 15:56:15
*/


-- ----------------------------
-- Table structure for _GF_CS_BuyLogs
-- ----------------------------
DROP TABLE [dbo].[_GF_CS_BuyLogs]
GO
CREATE TABLE [dbo].[_GF_CS_BuyLogs] (
[LogId] bigint NOT NULL IDENTITY(1,1) ,
[AccountId] bigint NULL ,
[Type] char(1) NULL ,
[Value] bigint NULL ,
[Date] datetime NULL 
)


GO

-- ----------------------------
-- Indexes structure for table _GF_CS_BuyLogs
-- ----------------------------

-- ----------------------------
-- Primary Key structure for table _GF_CS_BuyLogs
-- ----------------------------
ALTER TABLE [dbo].[_GF_CS_BuyLogs] ADD PRIMARY KEY ([LogId])
GO

-- ----------------------------
-- Foreign Key structure for table [dbo].[_GF_CS_BuyLogs]
-- ----------------------------
ALTER TABLE [dbo].[_GF_CS_BuyLogs] ADD FOREIGN KEY ([AccountId]) REFERENCES [dbo].[Account] ([AccountId]) ON DELETE NO ACTION ON UPDATE NO ACTION
GO
