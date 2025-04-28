以下に、プロジェクトの **README.md** を構成例とともに作成します。Markdown形式で記載しているため、そのままプロジェクトルートに配置してください。

---

```markdown
# AI Schedule Manager

FlaskベースのAIスケジュール管理アプリケーション。自然言語入力で予定を自動登録できる機能を備えています。

## 🚀 主な機能
- **自然言語予定登録** (例: 「来週月曜15時に打ち合わせ」)
- カレンダーUI（FullCalendar.js）
- モーダルフォームでの予定追加
- ローカルDB（SQLite）利用
- OpenAI API連携（GPT-3.5）

## 📁 プロジェクト構成
```
AI_Schedule_Manager/
├── app/
│   ├── __init__.py       # Flaskアプリ初期化
│   ├── config.py         # 設定クラス
│   ├── models.py         # DBモデル定義
│   ├── routes.py         # ルーティング/APIエンドポイント
│   ├── static/
│   │   └── js/
│   │       └── calendar.js # フロントエンドスクリプト
│   ├── templates/
│   │   └── index.html    # メインHTMLテンプレート
│   └── services/         # （将来拡張用）
├── venv/                 # Python仮想環境
├── run.py                # アプリ起動スクリプト
├── .env                  # 環境変数設定
└── .gitignore
```

## 🔧 セットアップ

### 前提条件
- Python 3.8+
- OpenAI APIキー（本番モードの場合）

### インストール手順
```bash
# 1. リポジトリクローン
git clone [your-repo-url]
cd AI_Schedule_Manager

# 2. 仮想環境作成 & 有効化
python -m venv venv
source venv/bin/activate  # macOS/Linux
# venv\Scripts\activate   # Windows

# 3. 依存ライブラリインストール
pip install -r requirements.txt  # または以下を直接実行
pip install flask flask-sqlalchemy openai python-dotenv
```

### 環境設定
`.env` ファイルを作成:
```ini
OPENAI_API_KEY=your_api_key_here  # 本番用
TEST_MODE=1                       # 0=本番モード, 1=モックモード
SECRET_KEY=your_secret_key_here
```

## 🖥️ 起動方法
```bash
python run.py
```
→ http://localhost:5000 でアクセス

## 🌟 開発モード
- **モックAPIモード**: `.env` で `TEST_MODE=1` に設定すると、OpenAI APIを使わず固定レスポンスを返します
- サンプル入力: 「打ち合わせ」「食事」など（動的モック対応）

## 📌 主要ファイル説明
| ファイル | 説明 |
|----------|------|
| `app/routes.py` | 全APIルート定義<br>- `/`: カレンダー表示<br>- `/add`: 予定追加<br>- `/ai-parse`: AI解析API |
| `app/models.py` | SQLAlchemyモデル定義<br>`Schedule` クラスがDBテーブルに対応 |
| `static/js/calendar.js` | FullCalendarの設定<br>- 日付クリック処理<br>- AIフォームの送信処理 |

## 💡 カスタマイズ例
### 本番環境向け設定
```python
# config.py
class ProductionConfig(Config):
    SQLALCHEMY_DATABASE_URI = 'postgresql://user:pass@localhost/dbname'
    TEST_MODE = 0
```

### 追加ライブラリ
```bash
pip install flask-login  # ユーザー認証用
pip install gunicorn    # 本番サーバー
```

## 📜 ライセンス
MIT License
```

---

## 補足説明
1. **テストモードの利点**:
   - OpenAI APIキーがなくてもフロントエンドの動作確認可能
   - 開発時にAPIコストが発生しない

2. **今後追加したい機能**:
   - ユーザー認証（Flask-Login）
   - 予定のカテゴリ分け
   - リマインダー通知機能

3. **本番デプロイ時の注意**:
   - `TEST_MODE=0` に必ず設定
   - `SECRET_KEY` はランダムな文字列に変更

必要に応じてプロジェクトの特徴や技術スタックなどを追加してください。