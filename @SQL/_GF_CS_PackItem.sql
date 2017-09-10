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

Date: 2017-09-10 15:56:31
*/


-- ----------------------------
-- Table structure for _GF_CS_PackItem
-- ----------------------------
DROP TABLE [dbo].[_GF_CS_PackItem]
GO
CREATE TABLE [dbo].[_GF_CS_PackItem] (
[PackItemId] int NOT NULL IDENTITY(1,1) ,
[PackId] int NOT NULL ,
[ItemVnum] int NOT NULL ,
[ItemQuantity] int NOT NULL ,
[ItemUpgrade] int NULL 
)


GO
ALTER TABLE [dbo].[_GF_CS_PackItem] SET (LOCK_ESCALATION = AUTO)
GO

-- ----------------------------
-- Indexes structure for table _GF_CS_PackItem
-- ----------------------------

-- ----------------------------
-- Primary Key structure for table _GF_CS_PackItem
-- ----------------------------
ALTER TABLE [dbo].[_GF_CS_PackItem] ADD PRIMARY KEY ([PackItemId])
GO

-- ----------------------------
-- Foreign Key structure for table [dbo].[_GF_CS_PackItem]
-- ----------------------------
ALTER TABLE [dbo].[_GF_CS_PackItem] ADD FOREIGN KEY ([PackId]) REFERENCES [dbo].[_GF_CS_Packs] ([PackId]) ON DELETE NO ACTION ON UPDATE NO ACTION
GO
