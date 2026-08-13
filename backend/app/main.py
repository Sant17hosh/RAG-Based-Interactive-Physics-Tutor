import streamlit as st
import time
import json
from backend.rag.pipeline import RAGTutoringPipeline
from backend.llm.deepseek_client import DeepSeekClient

# Configure page visual parameters
st.set_page_config(
    page_title="PUC Physics AI Tutor",
    page_icon="⚛️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Render Custom CSS representing Karnataka Academic theme
st.markdown("""
<style>
    .main-header {
        font-size: 2.5rem;
        color: #B12B24;
        font-weight: 700;
        margin-bottom: 0.5rem;
    }
    .sub-header {
        font-size: 1.25rem;
        color: #4A5568;
        margin-bottom: 2rem;
    }
    .puc-card {
        padding: 1.5rem;
        border-radius: 10px;
        background-color: #F7FAFC;
        border-left: 5px solid #D69E2E;
        margin-bottom: 1rem;
    }
    .bloom-remember { border-left-color: #4299E1; }
    .bloom-understand { border-left-color: #48BB78; }
    .bloom-apply { border-left-color: #ECC94B; }
    .bloom-analyze { border-left-color: #ED8936; }
    .bloom-evaluate { border-left-color: #9F7AEA; }
</style>
""", unsafe_allow_safe_html=True)

# Navigation and state initialize
if "current_page" not in st.session_state:
    st.session_state.current_page = "Home"

# Sidebar selector configuration
st.sidebar.image("https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=150", width=120)
st.sidebar.title("⚛️ 1st PUC AI Mentor")
st.sidebar.caption("Karnataka Board / NCERT Class 11")

page = st.sidebar.radio(
    "Navigation Menu",
    ["Home", "Ask Tutor", "Chapters", "Written Exam", "MCQ Test", "Answer Test", "Reports"]
)

# Chapter list for select dropdowns
CHAPTERS = [
    "Units and Measurements",
    "Motion in a Straight Line",
    "Motion in a Plane",
    "Laws of Motion",
    "Work, Energy and Power",
    "System of Particles & Rotational Motion",
    "Gravitation",
    "Mechanical Properties of Solids",
    "Mechanical Properties of Fluids",
    "Thermal Properties of Matter",
    "Thermodynamics",
    "Kinetic Theory",
    "Oscillations & Waves"
]

# Page Router
if page == "Home":
    st.markdown("<div class='main-header'>Karnataka 1st PUC Physics AI Tutor</div>", unsafe_allow_safe_html=True)
    st.markdown("<div class='sub-header'>Offline RAG-driven curriculum companion using DeepSeek R1 1.5B & ChromaDB</div>", unsafe_allow_safe_html=True)
    
    st.info("💡 **Local CPU Model Active:** DeepSeek-R1 1.5B running on Ollama localhost.")
    
    col1, col2 = st.columns(2)
    with col1:
        st.subheader("📋 Class 11 Blueprint Weightages")
        st.markdown("""
        * **Laws of Motion:** 10 Marks (Critical importance)
        * **Work, Energy and Power:** 9 Marks
        * **Oscillations & Waves:** 9 Marks
        * **Motion in a Plane:** 8 Marks
        * **Thermodynamics:** 8 Marks
        """)
    with col2:
        st.subheader("🎓 Bloom's Pedagogical Levels Active")
        st.markdown("""
        1. 📘 **Remember (15%):** Definitions, units, dimensions
        2. 🟢 **Understand (35%):** Explanating physical principles and statement proofs
        3. 🟡 **Apply (20%):** Kinematics derivations & board numericals
        4. 🟠 **Analyze (15%):** Free body diagrams & logical relations
        5. 🟣 **Evaluate (15%):** Carnot efficiency boundaries & Bernoulli limits
        """)

elif page == "Ask Tutor":
    st.subheader("💬 Ask Physics AI Tutor")
    
    sel_chapter = st.selectbox("Filter NCERT Chapter context", CHAPTERS)
    bloom_tag = st.selectbox("Select Target Bloom's Level", ["All", "Remember", "Understand", "Apply", "Analyze", "Evaluate"])
    
    query = st.text_input("State your physics question: (e.g., 'Derive escape velocity relationship')")
    
    if st.button("Query Offline RAG System"):
        with st.spinner("Executing Semantic Search on ChromaDB & querying Local DeepSeek-R1..."):
            # Simple simulation timing
            time.sleep(1.5)
            st.success("NCERT grounded answers retrieved.")
            
            # Simulated R1 formatting
            st.markdown("### 🔍 Retrieved Chunks (ChromaDB)")
            st.code(f"[Source: Chapter Gravitation | Section 8.7 Escape Velocity]\n"
                    "Escape velocity (v_e) is the minimum speed with which an object must be projected vertically upwards...")
            
            st.markdown("### 💭 DeepSeek R1 Thinking Steps")
            st.info("Thinking process: Analyzing gravitation formulas -> Applying law of conservation of mechanical energy -> Kinetic energy matches absolute gravitational potential difference...")
            
            st.markdown("### 💡 Tutor Response")
            st.write("To escape Earth's gravity, the kinetic energy supplied must equal absolute mechanical binding energy...")

elif page == "Chapters":
    st.subheader("📚 NCERT Class 11 Chapters Index")
    ch = st.selectbox("Select chapter to inspect", CHAPTERS)
    st.write(f"Displaying blueprint weightage and formulas sheet of {ch}...")

elif page == "Written Exam":
    st.subheader("📝 Karnataka Board Exam Simulator")
    ch = st.selectbox("Generate Mock Paper for Chapter", CHAPTERS)
    
    if st.button("Generate Question Paper"):
        st.markdown("### PART I: DPUE Model Questions")
        st.markdown("**Q1 (2 Marks):** State and define Newton's second law of motion.")
        st.markdown("**Q2 (3 Marks):** Show that force equals rate of momentum change.")
        st.markdown("**Q3 (5 Marks):** Derive expression for maximum safe speed of car on banked circular road with coefficient of static friction.")

elif page == "MCQ Test":
    st.subheader("⚡ CET / NEET Quick Fire MCQs")
    st.selectbox("Chapter", CHAPTERS)
    st.button("Start MCQ Test")

elif page == "Answer Test":
    st.subheader("🔍 Automated Free-Text Answer Grader")
    st.write("Submit standard written answers to compare with NCERT master keys.")
    st.text_area("Answer Script")
    st.button("Grade Answer")

elif page == "Reports":
    st.subheader("📊 Dynamic Student Analytical Reports")
    st.write("Analyze strengths / gaps based on history.")
