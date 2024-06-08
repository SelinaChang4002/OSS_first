import datetime
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from starlette.templating import Jinja2Templates
from starlette.requests import Request
from pydantic import BaseModel
from typing import List

app = FastAPI()

class Book(BaseModel):
    id: int = None
    title: str
    body: str
    date: str = None

books = []
index = 0

app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/book", response_model=Book)
async def create_book(book: Book):
    global index
    book.id = index
    book.date = datetime.datetime.now().isoformat()
    books.append(book)
    index += 1
    return book

@app.delete("/book/{book_id}")
async def delete_book(book_id: int):
    for i in range(len(books)):
        if books[i].id == book_id:
            del books[i]
            return {"message": "Book deleted"}
    raise HTTPException(status_code=404, detail="Book not found")

@app.get("/books", response_model=List[Book])
async def get_books():
    return books

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)