# どっち派？ (pick-one)

> 🗳️ 投票を通じて“違い”を楽しむ、思想的な投票アプリ

![image](https://github.com/user-attachments/assets/dce9e320-8a06-429a-8677-f0d87c6e7de8)
---

## ✨ コンセプト

**選ぶことは、自分の視点を表現する行為。**

このアプリは、単なる多数決のツールではありません。  
「朝ごはんはパン？ごはん？」といった日常の何気ない二者択一を通じて、  
**自分と他者の“選択の違い”そのものを楽しむ**ことを目的としています。

勝敗を決めるのではなく、そこに存在する多様な「理由」や「価値観」に光を当てる。  
少しだけ世界が面白く見える、そんな体験を目指しました。

> UIは軽やかに。  
> でも、根底に流れる思想は深く。  
> そのバランスを大切にしています。

---

## 🚀 主な機能

- ✅ **日替わり・予約投稿可能な投票** 管理画面から未来の日付を指定して、質問の公開を予約できます。

- ✅ **リアルタイムな結果表示** 投票後すぐに、円グラフで“みんな”の選択が視覚化されます。

- ✅ **匿名コメント機能** Supabaseをバックエンドに、各質問へのコメント投稿・表示機能を完全に実装。

- ✅ **管理者専用ダッシュボード** パスワードで保護された管理画面から、質問の作成・編集・削除・公開予約（CRUD）が可能です。

- ✅ **SNSシェア対応** Twitter(X)などでシェアした際に、サイトの顔となるOGP画像が美しく表示されます。

---

## 🛠️ 技術スタック

| カテゴリ | 使用技術 |
| :--- | :--- |
| **バックエンド** | ![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white) (PostgreSQL, RLS) |
| **フロントエンド** | ![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white) (App Router, Server Components) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black) |
| **スタイリング** | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white) |
| **グラフ描画** | `Chart.js`, `react-chartjs-2` |
| **デプロイ** | ![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white) (Serverless Functions) |

---

## 💡 開発の道のりと学び

このプロジェクトは、シンプルなMVPから始まり、数々の技術的挑戦を経て現在の形に至りました。

特に、Next.js App Routerのモダンなアーキテクチャ（サーバーコンポーネントによるデータ取得など）へのリファクタリングは、パフォーマンスと保守性を大きく向上させました。

また、VercelのEdge Runtimeにおける`ImageResponse`を用いた動的OGP画像生成では、原因不明のビルドエラーとの長い戦いを経験しました。フォントの扱い、クライアントの初期化、型定義、ビルドキャッシュ、実行環境の差異など、あらゆる可能性を試した末、最終的には**安定性を最優先し、静的なOGP画像に切り替える**という、プロダクト開発における現実的で重要な意思決定を行いました。この経験は、単なる技術力以上に、プロジェクトを完成に導く上での大きな学びとなっています。

---

## ✅ 現在のステータス

当初のMVP構想をすべて達成し、**一つの完成されたWebサービスとして安定稼働している段階**です。

投票、結果確認、コメント投稿、SNSシェア、そしてそれらを裏で支える管理者機能まで、一連の体験がシームレスに提供されています。

---

## 🔮 今後の展望

このアプリは、今後も“違いを楽しむ場”として成長を続けます。考えられる次のステップは…

- [ ] **ユーザー認証機能（Supabase Auth）**
  - ソーシャルログインを導入し、「マイページ」で自分の投票・コメント履歴を振り返れるようにする。
- [ ] **高度な管理者ダッシュボード**
  - 投票の傾向などを分析できるアナリティクス機能を追加する。
- [ ] **多様な投票フォーマット**
  - 3択以上の質問や、画像を使った投票など、新しい形式を導入する。
- [ ] **通知機能**
  - 新しい質問が公開されたら、希望するユーザーにプッシュ通知を送る。
