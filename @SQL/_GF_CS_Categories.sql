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

Date: 2017-09-10 15:56:24
*/


-- ----------------------------
-- Table structure for _GF_CS_Categories
-- ----------------------------
DROP TABLE [dbo].[_GF_CS_Categories]
GO
CREATE TABLE [dbo].[_GF_CS_Categories] (
[CategoryId] smallint NOT NULL IDENTITY(1,1) ,
[Name] varchar(60) NOT NULL 
)


GO
ALTER TABLE [dbo].[_GF_CS_Categories] SET (LOCK_ESCALATION = AUTO)
GO
DBCC CHECKIDENT(N'[dbo].[_GF_CS_Categories]', RESEED, 4)
GO

-- ----------------------------
-- Indexes structure for table _GF_CS_Categories
-- ----------------------------

-- ----------------------------
-- Primary Key structure for table _GF_CS_Categories
-- ----------------------------
ALTER TABLE [dbo].[_GF_CS_Categories] ADD PRIMARY KEY ([CategoryId])
GO
