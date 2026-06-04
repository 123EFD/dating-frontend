from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd

app = FastAPI()

# ==========================================
# 1. SECURITY & CORS SETTINGS
# ==========================================
# This allows your React Native app (or any IP) to communicate with this backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# 2. WAKE UP THE MODELS
# ==========================================
# Load the exported pipeline components from Google Colab
model = joblib.load("models/xgboost_model.pkl")
scaler = joblib.load("models/scaler.pkl")
feat_encoder = joblib.load("models/feature_encoder.pkl")
target_encoder = joblib.load("models/target_encoder.pkl")

# ==========================================
# 3. THE 40 EXPECTED COLUMNS
# ==========================================
# IMPORTANT: Replace this list with the exact output of `print(X_train.columns.tolist())` 
# from your Colab notebook to ensure it perfectly matches the trained model.
EXPECTED_COLUMNS = [
    'sexual_orientation', 'income_bracket', 'likes_received', 'mutual_matches', 
    'profile_pics_count', 'bio_length', 'emoji_usage_rate', 'last_active_hour', 
    'match_outcome', 'age', 'height_cm', 'weight_kg', 'zodiac_sign', 'body_type', 
    'relationship_intent', 'gender_Female', 'gender_Genderfluid', 'gender_Male', 
    'gender_Non-binary', 'gender_Prefer Not to Say', 'gender_Transgender', 
    'location_type_Metro', 'location_type_Remote Area', 'location_type_Rural', 
    'location_type_Small Town', 'location_type_Suburban', 'location_type_Urban', 
    'swipe_time_of_day_After Midnight', 'swipe_time_of_day_Afternoon', 
    'swipe_time_of_day_Early Morning', 'swipe_time_of_day_Evening', 
    'swipe_time_of_day_Late Night', 'swipe_time_of_day_Morning', 'education_level_score', 
    'bio_length_scaled', 'engagement_density', 'swipe_efficiency', 
    'interest_PC1', 'interest_PC2', 'interest_PC3'
]

# ==========================================
# 4. THE PREDICTION ENDPOINT
# ==========================================
@app.get("/")
def read_root():
    return {"message": "Archetype API is running and ready for predictions!"}

@app.post("/predict")
def predict_archetype(data: dict):
    # Convert incoming raw JSON from React Native into a Pandas DataFrame
    df_input = pd.DataFrame([data])
    
    # --- PIPELINE STEP A: Feature Engineering ---
    # Calculate the engineered ratios we built in Jupyter
    if 'message_sent_count' in df_input.columns and 'app_usage_time_min' in df_input.columns:
        df_input['engagement_density'] = df_input['message_sent_count'] / (df_input['app_usage_time_min'] + 1)
        
    if 'mutual_matches' in df_input.columns and 'swipe_right_ratio' in df_input.columns:
        df_input['swipe_efficiency'] = df_input['mutual_matches'] / (df_input['swipe_right_ratio'] + 0.01)

    # --- PIPELINE STEP B: Text Encoding ---
    # If the app sends raw words (like income_bracket), convert them to numbers
    text_columns = df_input.select_dtypes(include=['object']).columns
    for col in text_columns:
        if col in EXPECTED_COLUMNS: 
            try:
                # Transform the word using the Colab encoder memory
                df_input[col] = feat_encoder.transform(df_input[col].astype(str))
            except ValueError:
                # If the app sends a brand new word we've never seen, default to 0
                df_input[col] = 0 

    # --- PIPELINE STEP C: Align to the 40 Columns ---
    # Create the blank 40-column template filled with zeros
    df_aligned = pd.DataFrame(0, index=[0], columns=EXPECTED_COLUMNS)
    
    # Map the app data into the correct slots in the 40-column template
    for col in df_input.columns:
        if col in df_aligned.columns:
            df_aligned[col] = df_input[col]
            
    # --- PIPELINE STEP D: Scale & Predict ---
    # 1. Scale the data using our saved Z-score scaler
    scaled_data = scaler.transform(df_aligned)
    
    # 2. Feed the math into the XGBoost algorithm
    prediction_number = model.predict(scaled_data)

    # 3. Translate the mathematical output (0, 1, or 2) back into human words
    final_word = target_encoder.inverse_transform(prediction_number)[0]
    
    # Return the final result to the React Native app
    return {"archetype": final_word}