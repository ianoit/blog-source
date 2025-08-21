---
title: "{{ replace .File.ContentBaseName "-" " " | title }}"
date: {{ .Date }}
draft: false
author: "Penulis Blog"
categories: [""]
tags: [""]
year: ["{{ dateFormat "2006" .Date }}"]
month: ["{{ dateFormat "2006/01" .Date }}"]
---
