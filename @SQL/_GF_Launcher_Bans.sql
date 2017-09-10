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

Date: 2017-09-10 15:56:43
*/


-- ----------------------------
-- Table structure for _GF_Launcher_Bans
-- ----------------------------
DROP TABLE [dbo].[_GF_Launcher_Bans]
GO
CREATE TABLE [dbo].[_GF_Launcher_Bans] (
[BanId] int NOT NULL IDENTITY(1,1) ,
[Value] varchar(255) NULL 
)


GO
ALTER TABLE [dbo].[_GF_Launcher_Bans] SET (LOCK_ESCALATION = AUTO)
GO
