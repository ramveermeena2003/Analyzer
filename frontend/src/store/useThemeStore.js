import {create} from "zustand"

export const useThemeStore = create((set) => ({
    theme : localStorage.getItem("analyzer-theme") || "dark",
    setTheme : (theme) =>{
        localStorage.setItem("analyzer-theme",theme);
        set({theme});
    },
    
}));