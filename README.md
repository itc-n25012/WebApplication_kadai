# 基本情報技術者試験対策 Web アプリ

## 概要

基本情報技術者試験（午前問題）の学習を目的とした Web アプリケーション。

## 使用技術

- Next.js (App Router)
- TypeScript
- ESLint
- CSS Modules
- microCMS
- GitHub
- Vercel

## 機能一覧

- 問題一覧表示
- 問題詳細表示
- microCMS による問題管理
- 分野別学習
- レスポンシブ対応
- 学習履歴機
- 問題復習機能

## ページ構成

- 🏠 `/`
  トップページ  
  分野と問題数を選択して学習を開始します。

- 📝 `/questions`
  問題出題ページ  
  選択した分野の問題がクイズ形式で出題されます。

- 📊 `/history`
  学習履歴ページ  
  過去の学習結果（日時・正答率など）を確認できます。

- 🔁 `/review`
  復習ページ  
  間違えた問題をまとめて再挑戦できます。

## デプロイ

Vercel を使用して公開

# WebApplication_kadai
