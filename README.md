# どっち派？ (Which Prefer)

> 🗳️ 投票を通じて“違い”を楽しむ、思想的な投票アプリ

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

- ✅ **日替わりの2択投票**  
  毎日新しい問いに出会えます。

- ✅ **リアルタイムな結果表示**  
  投票後すぐに、円グラフで“みんな”の選択が視覚化されます。

- ✅ **投票履歴の保持（localStorage）**  
  同じ質問に複数回投票できないよう制御しています。

- ✅ **コメント機能（UIのみ）**  
  「なぜそれを選んだのか？」という対話のきっかけとなるコメント欄を表示。  
  投稿機能は今後のアップデートで追加予定です。

---

## 🛠️ 技術スタック

| カテゴリ         | 使用技術                                                                                                                              |
| :--------------- | :------------------------------------------------------------------------------------------------------------------------------------ |
| **フロントエンド** | ![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black) |
| **スタイリング** | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)                   |
| **状態管理** | `useState`, `useEffect`, `localStorage`                                                                                               |
| **グラフ描画** | `Chart.js`, `react-chartjs-2`                                                                                                         |
| **デプロイ** | ![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)                                     |

---

## 🧪 現在のステータス

このアプリは現在、**MVP（最小実用機能）まで完成した段階**です。  
「投票 → 結果 → コメントを読む」までの一連の体験はすでに提供されています。  
今後、以下の機能を追加しながら、より深く・広く“違いを楽しむ場”を育てていきます。

---

## 🔮 今後の実装予定

- [ ] **コメント投稿の保存機能**（localStorageまたはSupabase）
- [ ] **投票結果の集計**
- [ ] **管理画面による質問予約投稿**
